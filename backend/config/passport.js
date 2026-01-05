const db = require('../db/queries')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

passport.use(
    new LocalStrategy(
        {usernameField: 'username', passwordField: 'password'},
        async (username, password, done) => {
            try {
                const user = await db.getUser(username)

                if (!user){
                    return done(null, false, {message: 'The email address or password you entered is incorrect'})
                }

                const match = await bcrypt.compare(password, user.password)

                if (!match){
                    return done(null, false, {message: 'The email address or password you entered is incorrect'})
                }

                return done(null, user)
            } catch (err){
                return done(err)
            }
        }
    )
)

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await db.getUserByID(id)
        done(null, user)
    } catch (err){
        done(err)
    }
})

module.exports = passport