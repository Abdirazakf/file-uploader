const {Router} = require('express')
const signupRouter = Router()
const {checkValidUserPost} = require('../controllers/signupController.js')

signupRouter.post('/', checkValidUserPost)

module.exports = signupRouter