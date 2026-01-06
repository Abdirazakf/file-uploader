const passport = require('passport')

exports.authenticateUser = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err){
            return next(err)
        }

        if (!user){
            return res.status(401).json({
                success: false,
                errors: [{msg: info.message || 'Login failed'}]
            })
        }

        req.logIn(user, (err) => {
            if (err){
                return next(err)
            }

            return res.json({
                success: true,
                msg: 'Login successful',
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name
                }
            })
        })
    })(req, res, next)
}