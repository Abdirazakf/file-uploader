require('dotenv').config()
const express = require("express")

const app = express()

app.listen(process.env.PORT, (err) => {
    if (err){
        console.log(err)
    }

    console.log("App is running at port " + process.env.PORT)
})