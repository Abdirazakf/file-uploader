const prisma = require('./lib/prisma')

async function buildPath(id, userId){
    if (!id){
        return []
    }

    const folder = await prisma.folder.findFirst({
        where: {
            id,
            userId
        },
        select: {
            id: true,
            name: true,
            parentId: true
        }
    })

    if (!folder){
        return []
    }

    if (folder.parentId){
        const parentPath = await buildPath(folder.parentId, userId)
        return [...parentPath, { id: folder.id, name: folder.name}]
    }

    return [{ id: folder.id, name: folder.name }]
}

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

    folder.path = await buildPath(folder.id, userId)

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
            createdAt: 'asc'
        }
    })

    for (const folder of folders) {
        folder.path = [{ id: folder.id, name: folder.name }]
    }

    return folders
}

async function getFolderByID (id, userId) {
    const folder = await prisma.folder.findFirst({
        where: {
            id,
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

    if (!folder) return null

    folder.path = await buildPath(id, userId)

    return folder
}

async function updateFolder (id, userId, newName){
    const folder = await prisma.folder.updateMany({
        where: {
            id,
            userId
        },
        data: {
            name: newName
        }
    })

    if (folder.count === 0){
        return null
    }

    return await getFolderByID(id, userId)
}

async function deleteFolder (id, userId){
    const folder = await prisma.folder.deleteMany({
        where: {
            id,
            userId
        }
    })

    return folder.count > 0
}

async function checkFolderOwner (id, userId){
    const folder = await prisma.folder.findFirst({
        where: {
            id,
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
    checkFolderOwner,
    buildPath
}