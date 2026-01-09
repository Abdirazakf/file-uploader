const prisma = require('./lib/prisma')

async function createFolder (name, userId, parentId = null){
    const folder = await prisma.folder.create({
        data: {
            name,
            userId,
            parentId
        },
        include: {
            parent: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    })

    return folder
}

async function getUserRootFolders (userId){
    const folders = await prisma.folder.findMany({
        where: {
            userId,
            parentId: null
        },
        include: {
            subfolders: {
                select: {
                    id: true,
                    name: true,
                    createdAt: true
                }
            },
            _count: {
                select: {
                    files: true,
                    subfolders: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return folders
}

async function getFolderByID (folderId, userId) {
    const folder = await prisma.folder.findFirst({
        where: {
            id: folderId,
            userId
        },
        include: {
            parent: {
                select: {
                    id: true,
                    name: true
                }
            },
            subfolders: {
                select: {
                    id: true,
                    name: true,
                    createdAt: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            },
            files: {
                select: {
                    id: true,
                    name: true,
                    originalName: true,
                    size: true,
                    mimeType: true,
                    url: true,
                    createdAt: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            },
            _count: {
                select: {
                    files: true,
                    subfolders: true
                }
            }
        }
    })

    return folder
}

async function updateFolder (folderId, userId, newName){
    const folder = await prisma.folder.updateMany({
        where: {
            id: folderId,
            userId
        },
        data: {
            name: newName
        }
    })

    if (folder.count === 0){
        return null
    }

    return await getFolderByID(folderId, userId)
}

async function deleteFolder (folderId, userId){
    const folder = await prisma.folder.deleteMany({
        where: {
            id: folderId,
            userId
        }
    })

    return folder.count > 0
}

async function checkFolderOwner (folderId, userId){
    const folder = await prisma.folder.findFirst({
        where: {
            id: folderId,
            userId
        }
    })

    return folder !== null
}

module.exports = {
    createFolder,
    getUserRootFolders,
    getFolderByID,
    updateFolder,
    deleteFolder,
    checkFolderOwner
}