const express = require("express")
const dotenv = require("dotenv")

const app = express()
dotenv.config()

const PORT = process.env.PORT || 3002

app.get('/',(req,res)=>{
    res.send('Server_2: Health Check Ok!')
})

app.listen(PORT, ()=>{
    console.log("server running at port", PORT)
})