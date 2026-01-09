require('dotenv').config()
const express = require("express")
const session = require("express-session")
const cors = require('cors')
const { PrismaSessionStore } = require('@quixo3/prisma-session-store')
const prisma = require("./db/lib/prisma.js")
const passport = require('./config/passport.js')
const path = require('path')

const signupRouter = require('./routes/signupRouter.js')
const loginRouter = require('./routes/loginRouter.js')
const authRouter = require('./routes/authRouter.js')
const uploadRouter = require('./routes/uploadRouter.js')
const folderRouter = require('./routes/folderRouter.js')

const app = express()
const port = process.env.PORT || 3000

// Trust Railway's proxy
if (process.env.NODE_ENV === 'prod') {
    app.set('trust proxy', 1)
}

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(cors({
    origin: true,
    credentials: true
}))

const sessionStore = new PrismaSessionStore(
    prisma,
    {
        checkPeriod: 2 * 60 * 1000,
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined
    }
)

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 1 Week
            secure: process.env.NODE_ENV === 'prod',
            httpOnly: true,
            sameSite: 'lax'
        },
    })
)

app.use(passport.initialize())
app.use(passport.session())

app.use('/api/sign-up', signupRouter)
app.use('/api/login', loginRouter)
app.use('/api/auth', authRouter)
app.use('/api/upload', uploadRouter)
app.use('/api/folders', folderRouter)

if (process.env.NODE_ENV === 'prod'){
    app.use(express.static(path.join(__dirname, '../frontend/dist')))

    app.use((req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
    })
}

app.use((err, req, res, next) => {
    console.error('Server Error:', err)
    res.status(500).json({
        errors: [{msg: "Something went wrong on the server"}]
    })
})

app.listen(port, (err) => {
    if (err){
        console.log(err)
    }

    console.log("App is running at port " + port)
})