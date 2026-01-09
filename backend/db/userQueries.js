const prisma = require('./lib/prisma')

async function getUser (email){
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    return user
}

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

async function checkEmail (email){
    const existingUser = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    return existingUser
}

async function createUser (email, password, name){
    const newUser = await prisma.user.create({
        data: {
            email,
            password,
            name
        }
    })

    return newUser
}

module.exports = {
    getUser,
    getUserByID,
    checkEmail,
    createUser
}