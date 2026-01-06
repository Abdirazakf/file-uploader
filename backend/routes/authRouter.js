const {Router} = require('express')
const authRouter = Router()
const authController = require('../controllers/authController')

authRouter.get('/status', authController.checkAuth)
authRouter.post('/logout', authController.logout)

module.exports = authRouter