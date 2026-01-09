const multer = require('multer')
const upload = multer({dest: 'uploads/'})

exports.uploadMiddleware = upload.single('uploaded_file')

exports.fileUploadPost = async (req, res, next) => {
    try {
        if (!req.file){
            return res.status(500).json({
                success: false,
                errors: [{msg: 'No file uploaded'}]
            })
        }

        res.status(200).json({
            success: true,
            msg: 'Upload successful',
            file: {
                name: req.file.filename,
                originalName: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size,
                path: req.file.path,
            }
        })
    } catch(err){
        console.error(err)
        next(err)
    }
}