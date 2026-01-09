const {Router} = require('express')
const loginRouter = Router()
const {authenticateUser} = require('../controllers/loginController')

loginRouter.post('/', authenticateUser)

module.exports = loginRouter