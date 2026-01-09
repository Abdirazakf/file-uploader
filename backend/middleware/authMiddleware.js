const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()){
        return next()
    }

    return res.status(401).json({
        success: false,
        errors: [{msg: 'Authentication required'}]
    })
}

module.exports = isAuthenticated