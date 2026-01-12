const { Router } = require('express')
const fileRouter = Router()
const {
    uploadMiddleware,
    uploadFile,
    getRootFiles,
    getFileByID,
    updateFile,
    deleteFile,
} = require('../controllers/fileController')

fileRouter.get('/', getRootFiles)
fileRouter.get('/:id', getFileByID)

fileRouter.post('/', uploadMiddleware, uploadFile)

fileRouter.put('/:id', updateFile)

fileRouter.delete('/:id', deleteFile)

module.exports = fileRouter