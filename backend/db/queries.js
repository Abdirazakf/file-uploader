async function getUserByID (id){
    const user = await prisma.user.findUnique({
        where: {
            id: id
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