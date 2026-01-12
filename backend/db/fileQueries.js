const prisma = require('./lib/prisma')

async function createFile(name, originalName, size, mimeType, url, userId, folderId = null){
    const file = await prisma.file.create({
        data: {
            name,
            originalName,
            size,
            mimeType,
            url,
            userId,
            folderId
        },
        include: {
            folder: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    })

    return file
}

async function getUserRootFiles(userId){
    const files = await prisma.file.findMany({
        where: {
            userId,
            folderId: null
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return files
}

async function getFolderFiles(folderId, userId){
    const files = await prisma.file.findMany({
        where: {
            folderId,
            userId
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return files
}

async function getFileById(id, userId){
    const file = await prisma.file.findFirst({
        where: {
            id,
            userId
        },
        include: {
            folder: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    })

    return file
}

async function updateFile(id, userId, updates){
    const file = await prisma.file.updateMany({
        where: {
            id,
            userId
        },
        data: updates
    })

    if (file.count === 0){
        return null
    }

    return await getFileById(id, userId )
}

async function deleteFile(id, userId){
    const file = await prisma.file.deleteMany({
        where: {
            id,
            userId
        }
    })

    return file.count > 0
}

async function checkFileOwner(id, userId){
    const file = await prisma.file.findFirst({
        where: {
            id,
            userId
        }
    })

    return file !== null
}

async function getAllFiles(userId){
    const files = await prisma.file.findMany({
        where: {
            userId
        },
        include: {
            folder: {
                select: {
                    id: true,
                    name: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return files
}

async function searchUserFiles(userId, searchTerm){
    const files = await prisma.file.findMany({
        where: {
            userId,
            OR: [
                {
                    name: {
                        contains: searchTerm,
                        mode: 'insensitive'
                    }
                },
                {
                    originalName: {
                        contains: searchTerm,
                        mode: 'insensitive'
                    }
                }
            ]
        },
        include: {
            folder: {
                select: {
                    id: true,
                    name: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return files
}



module.exports = {
    createFile,
    getUserRootFiles,
    getFolderFiles,
    getFileById,
    updateFile,
    deleteFile,
    checkFileOwner,
    getAllFiles,
    searchUserFiles
}