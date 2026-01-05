require('dotenv').config()
const express = require("express")
const session = require("express-session")
const { PrismaSessionStore } = require('@quixo3/prisma-session-store')
const prisma = require("./db/lib/prisma.js")
const passport = require('./config/passport.js')
const cors = require('cors')

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

app.listen(port, (err) => {
    if (err){
        console.log(err)
    }

    console.log("App is running at port " + port)
})