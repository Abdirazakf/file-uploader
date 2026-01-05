require('dotenv').config()
const express = require("express")
const session = require("express-session")
const { PrismaPg } = require('@prisma/adapter-pg')
const { PrismaClient } = require('./db/generated/prisma/client.js')
const { PrismaSessionStore } = require('@quixo3/prisma-session-store')

const app = express()

const connectionString = process.env.DATABASE_URL
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

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
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000 // 1 Week
        },
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: sessionStore
    })
)
app.listen(process.env.PORT, (err) => {
    if (err){
        console.log(err)
    }

    console.log("App is running at port " + process.env.PORT)
})