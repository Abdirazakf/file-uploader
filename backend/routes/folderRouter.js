const {Router} = require('express')
const folderRouter = Router()
const {
        getUserFolders,
        getFolderByID,
        createFolderPost,
        updateFolderPut,
        deleteFolder
    } = require('../controllers/folderController')

folderRouter.get('/', getUserFolders)
folderRouter.get('/:id', getFolderByID)

folderRouter.post('/', createFolderPost)

folderRouter.put('/:id', updateFolderPut)

folderRouter.delete('/:id', deleteFolder)

module.exports = folderRouter