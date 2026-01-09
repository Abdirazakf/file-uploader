const db = require('../db/folderQueries')
const {body, param, validationResult, matchedData} = require('express-validator')

const nameErr = "Folder name must be between 1-255 chars and cannot contain special characters"
const idErr = "Invalid folder ID"
const parentIdErr = "Invalid parent folder ID"

const validateFolderName = [
    body('name').trim().notEmpty()
    .isLength({min: 1, max: 255})
    .matches(/^[^/\\:*?"<>|]+$/)
    .withMessage(nameErr)
]

const validateFolderID = [
    param('id').notEmpty()
    .isUUID().withMessage(idErr)
]

const validateParentID = [
    body('parentId').trim()
    .optional().isUUID()
    .withMessage(parentIdErr)
]

exports.getUserFolders = async (req, res, next) => {
    try {
        const id = req.user.id
        const folders = await db.getUserRootFolders(id)

        res.json({
            success: true,
            folders
        })
    } catch (err){
        console.error('Get folders error:', err)
        next(err)
    }
}

exports.getFolderByID = [
    validateFolderID,
    async (req, res, next) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array()
            })
        }

        try {
            const { id } = req.params
            const userId = req.user.id

            const folder = await db.getFolderByID(id, userId)

            if (!folder){
                return res.status(404).json({
                    success: false,
                    errors: [{msg: 'Folder not found'}]
                })
            }

            res.json({
                success: true,
                folder
            })
        } catch (err){
            console.error('Get folder error:', err)
            next(err)
        }
    }
]

exports.createFolderPost = [
    validateFolderName,
    validateParentID,
    async (req, res, next) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array()
            })
        }

        try {
            const { name, parentId } = matchedData(req)
            const id = req.user.id

            if (parentId){
                const ownsParent = await db.checkFolderOwner(parentId, id)

                if (!ownsParent){
                    return res.status(403).json({
                        success: false,
                        errors: [{msg: 'Parent folder not found'}]
                    })
                }
            }

            const folder = await db.createFolder(name, id, parentId || null)

            res.status(201).json({
                success: 'true',
                msg: 'Folder created successfully',
                folder
            })
        } catch (err){
            console.error('Create folder error:', err)
            next(err)
        }
    }
]

exports.updateFolderPut = [
    validateFolderID,
    validateFolderName,
    async (req, res, next) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array()
            })
        }

        try {
            const { id } = req.params
            const { name } = matchedData(req)
            const userId = req.user.id

            const folder = await db.updateFolder(id, userId, name)

            if (!folder){
                return res.status(404).json({
                    success: false,
                    errors: [{msg: 'Folder not found'}]
                })
            }

            res.json({
                success: true,
                msg: 'Folder updated successfully',
                folder
            })
        } catch (err){
            console.error('Update folder error:', err)
            next(err)
        }
    }
]

exports.deleteFolder = [
    validateFolderID,
    async (req, res, next) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array()
            })
        }

        
        try {
            const { id } = req.params
            const userId = req.user.id
            
            const deleted = await db.deleteFolder(id, userId)

            if (!deleted){
                return res.status(404).json({
                    success: false,
                    errors: [{msg: 'Folder not found'}]
                })
            }

            res.json({
                success: true,
                msg: 'Folder and all its contents delete successfully'
            })
        } catch (err){
            console.error('Delete folder error:', err)
            next(err)
        }
    }
]