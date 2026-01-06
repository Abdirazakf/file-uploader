exports.checkAuth = (req, res) => {
    if (req.isAuthenticated()){
        return res.json({
            auth: true,
            user: {
                id: req.user.id,
                email: req.user.email,
                name: req.user.name
            }
        })
    } else {
        return res.json({
            auth: false,
            user: null
        })
    }
}

exports.logout = (req, res) => {
    req.logout((err) => {
        if (err){
            return res.status(500).json({
                success: false,
                errors: [{msg: "Error: Could not log out"}]
            })
        }

        res.json({
            success: true,
            msg: "Logged out successfully"
        })
    })
}