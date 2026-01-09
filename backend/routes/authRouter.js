const {Router} = require('express')
const authRouter = Router()
const {checkAuth, logout} = require('../controllers/authController')

authRouter.get('/status', checkAuth)
authRouter.post('/logout', logout)

module.exports = authRouter