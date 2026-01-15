const { Router } = require('express')
const fileRouter = Router()
const {
    uploadMiddleware,
    uploadFile,
    getRootFiles,
    getAllFiles,
    getFileByID,
    updateFile,
    deleteFile,
    downloadFile
} = require('../controllers/fileController')

fileRouter.get('/all', getAllFiles)
fileRouter.get('/', getRootFiles)
fileRouter.get('/:id', getFileByID)
fileRouter.get('/:id/download', downloadFile)

fileRouter.post('/', uploadMiddleware, uploadFile)

fileRouter.put('/:id', updateFile)

fileRouter.delete('/:id', deleteFile)

module.exports = fileRouter