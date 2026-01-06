const db = require('../db/queries')
const {body, validationResult, matchedData} = require('express-validator')
const bcrypt = require('bcryptjs')

const emailErr = "Invalid email address. Valid email can contain only a-z, 0-9, '@', '.'"
const passErr = "Password must be at least 6 chars with 1 uppercase, 1 number, and 1 symbol"
const nameErr = "Name is required"

const validateSignUp = [
    body('email').trim().notEmpty().isEmail()
    .withMessage(emailErr),
    body('password').trim().notEmpty().isStrongPassword({
        minLength: 6,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }).withMessage(passErr),
    body('name').trim().notEmpty()
    .withMessage(nameErr)
]

exports.checkValidUserPost = [
    validateSignUp,
    async (req, res, next) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array()
            })
        }

        try {
            const {email, password, name} = matchedData(req)

            const existingUser = await db.checkEmail(email)

            if (existingUser){
                return res.status(400).json({
                    errors: [{msg: "Email already taken"}]
                })
            }

            const hashedPass = await bcrypt.hash(password, 10)

            await db.createUser(email, hashedPass, name)

            return res.status(201).json({
                msg: 'User successfully created'
            })
        } catch (err){
            console.error('Sign up error:', err)
            next(err)
        }
    }
]