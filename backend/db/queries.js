const prisma = require('./lib/prisma')

async function getUserByID (id){
    const user = await prisma.user.findUnique({
        where: {
            id: id
        },
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            updatedAt: true
        }
    })

    return user
}

async function getUser (email){
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    return user
}

module.exports = {
    getUser,
    getUserByID
}