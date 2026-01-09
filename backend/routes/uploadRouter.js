const {Router} = require('express')
const uploadRouter = Router()
const {uploadMiddleware, fileUploadPost}= require('../controllers/uploadController')

uploadRouter.post('/', uploadMiddleware, fileUploadPost)

module.exports = uploadRouter