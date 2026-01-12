const fileDB = require('../db/fileQueries')
const folderDB = require('../db/folderQueries')
const supabase = require('../config/supabase')
const multer = require('multer')
const path = require('path')
const { body, param, validationResult, matchedData } = require('express-validator')

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024
    },
})

const idErr = 'Invalid file ID'
const nameErr = 'File name must be between 1 and 255 characters'
const folderIDErr = 'Invalid folder ID'

const validateFileID = [
    param('id').notEmpty()
    .isUUID().withMessage(idErr)
]

const validateFileOriginalName = [
    body('originalName').optional()
    .trim().notEmpty()
    .isLength({min: 1, max: 255})
    .withMessage(nameErr)
]

const validateFolderID = [
    body('folderId').optional()
    .isUUID().withMessage(folderIDErr)
]

exports.uploadMiddleware = upload.single('file')

exports.uploadFile = [
    validateFolderID,
    async (req, res, next) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()){
            return res.status(400).json({
                success: false,
                errors: errors.array()
            })
        }

        try {
            if (!req.file){
                return res.status(400).json({
                    success: false,
                    errors: [{msg: 'No file uploaded'}]
                })
            }

            const userId = req.user.id
            const { folderId } = req.body

            if (folderId){
                const isOwner = await folderDB.checkFolderOwner(folderId, userId)

                if (!isOwner){
                    return res.status(403).json({
                        success: false,
                        errors: [{msg: 'Folder not found'}]
                    })
                }
            }

            // Generate unique filename for Supabase
            const fileExt = path.extname(req.file.originalname)
            const uniqueName = `${userId}_${Date.now()}${fileExt}`
            const filePath = `${userId}/${uniqueName}`

            // Upload to Supabase
            const { data: uploadData, error: uploadError } = await supabase
                .storage
                .from(process.env.BUCKET_NAME)
                .upload(filePath, req.file.buffer, {
                    contentType: req.file.mimetype,
                    upsert: false
                })

            if (uploadError){
                return res.status(500).json({
                    success: false,
                    errors: [{msg: 'Failed to upload file'}]
                })
            }

            // Get public URL
            const { data: urlData } = supabase
                .storage
                .from(process.env.BUCKET_NAME)
                .getPublicUrl(filePath)

            const file = await fileDB.createFile(
                uniqueName,
                req.file.originalname,
                req.file.size,
                req.file.mimetype,
                urlData.publicUrl,
                userId,
                folderId || null
            )

            res.status(201).json({
                success: true,
                msg: 'File uploaded successfully',
                file
            })
        } catch (err){
            console.error('Upload error:', err)
            next(err)
        }
    }
]

exports.getRootFiles = async (req, res, next) => {
    try {
        const userId = req.user.id
        const files = await fileDB.getUserRootFiles(userId)

        res.json({
            success: true,
            files
        })
    } catch (err){
        console.error('Get root files error:', err)
        next(err)
    }
}

exports.getFileByID = [
    validateFileID,
    async (req, res, next) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()){
            return res.status(400).json({
                success: false,
                errors: errors.array()
            })
        }

        try {
            const { id } = req.params
            const userId = req.user.id

            const file = await fileDB.getFileById(id, userId)

            if (!file){
                return res.status(404).json({
                    success: false,
                    errors: [{msg: 'File not found'}]
                })
            }

            res.json({
                success: true,
                file
            })
        } catch (err){
            console.error('Get file error:', err)
            next(err)
        }
    }
]

exports.updateFile = [
    validateFileID,
    validateFileOriginalName,
    validateFolderID,
    async (req, res, next) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()){
            return res.status(400).json({
                success: false,
                errors: errors.array()
            })
        }

        try {
            const { id } = req.params
            const userId = req.user.id
            const { originalName, folderId } = matchedData(req)

            const updates = {}

            if (originalName !== undefined && originalName !== null){
                updates.originalName = originalName
            }

            if (folderId !== undefined && folderId !== null){
                const isOwner = await folderDB.checkFolderOwner(folderId, userId)

                if (!isOwner){
                    return res.status(403).json({
                        success: false,
                        errors: [{msg: 'Folder not found'}]
                    })
                }

                updates.folderId = folderId
            }

            if (Object.keys(updates).length === 0){
                return res.status(400).json({
                    success: false,
                    errors: [{msg: 'No updates'}]
                })
            }

            const file = await fileDB.updateFile(id, userId, updates)

            if (!file){
                return res.status(404).json({
                    success: false,
                    errors: [{msg: 'Failed to update file'}]
                })
            }

            res.json({
                success: true,
                msg: 'File updated successfully',
                file
            })
        } catch (err){
            console.error('Failed to update file:', err)
            next(err)
        }
    }
]

exports.deleteFile = [
    validateFileID,
    async (req, res, next) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()){
            return res.status(400).json({
                success: false,
                errors: errors.array()
            })
        }

        try {
            const { id } = req.params
            const userId = req.user.id

            const file = await fileDB.getFileById(id, userId)

            if (!file){
                return res.status(404).json({
                    success: false,
                    errors: [{msg: 'File not found'}]
                })
            }

            // Extract file path from URL
            // URL format: supabase.co/storage/v1/object/public/files/{userId}/{filename}

            const urlSplit = file.url.split('/files/')
            const filePath = urlSplit[1]

            // Delete from Supabase

            const { error: deleteError } = await supabase
                .storage
                .from(process.env.BUCKET_NAME)
                .remove([filePath])

            if (deleteError){
                console.error('Failed to delete from supabase:', deleteError)
            }

            // Delete from db

            const deleted = await fileDB.deleteFile(id, userId)

            if (!deleted){
                return res.status(404).json({
                    success: false,
                    errors: [{msg: 'File not found'}]
                })
            }

            res.json({
                success: true,
                msg: 'File deleted successfully'
            })
        } catch (err){
            console.error('Delete file error:', err)
            next(err)
        }
    }
]