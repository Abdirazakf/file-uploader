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
        folder.totalSize = await calculateSize(folder.id, userId)
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

    folder.totalSize = await calculateSize(id, userId)

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

async function calculateSize(folderId, userId,){
    const files = await prisma.file.findMany({
        where: {
            folderId,
            userId
        },
        select: {
            size: true
        }
    })

    let totalSize = files.reduce((sum, file) => sum + BigInt(file.size), BigInt(0))

    const subfolders = await prisma.folder.findMany({
        where: {
            parentId: folderId,
            userId
        },
        select: {
            id: true
        }
    })

    for (const subfolder of subfolders){
        const size = await calculateSize(subfolder.id, userId)
        totalSize += BigInt(size)
    }

    return totalSize.toString()
}

module.exports = {
    createFolder,
    getUserRootFolders,
    getFolderByID,
    updateFolder,
    deleteFolder,
    checkFolderOwner,
    buildPath,
    calculateSize
}