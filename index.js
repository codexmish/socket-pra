const express = require("express")
const dotenv = require("dotenv").config()
const app = express()

app.use(express.json())

app.listen(8000, ()=>{
    console.log("runnng");
    
})