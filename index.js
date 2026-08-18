const express = require("express")
const dotenv = require("dotenv").config()
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const app = express()

// app.use(express.json())
const server = createServer(app)
const io = new Server(server,{
    cors:{
        origin: "http://localhost:5173"
    }
})

let allTask = []

io.on('connection',(socket)=>{
    console.log("a user connected: ", socket.id);
    socket.on("task",(value)=>{
        // console.log(value);
        allTask.push(value)
        socket.emit("taskClient", allTask)
    })
    
    socket.on('disconnect', (dis)=>{
        console.log("disconnected", socket.id);
        
    })
})

server.listen(8000, ()=>{
    console.log("runnng  ");
})
