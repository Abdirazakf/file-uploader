const {Router} = require('express')
const signupRouter = Router()
const signupController = require('../controllers/signupController.js')


signupRouter.post('/', signupController.checkValidUserPost)

module.exports = signupRouter