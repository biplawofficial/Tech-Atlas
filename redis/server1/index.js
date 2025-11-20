const express = require("express")
const dotenv = require("dotenv")

const app = express()
dotenv.config()

const PORT = process.env.PORT || 3001

app.get('/',(req,res)=>{
    res.send('Server_1: Health Check Ok!')
})

app.listen(PORT, ()=>{
    console.log("server running at port", PORT)
})