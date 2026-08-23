const express = require("express")
const dotenv = require("dotenv").config()
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const dbConfig = require("./configs/dbConfig");
const dns = require("dns");
const taskSchema = require("./model/taskSchema");
const app = express()

dns.setServers(["8.8.8.8", "8.8.4.4"]);

// app.use(express.json())
const server = createServer(app)
const io = new Server(server,{
    cors:{
        origin: "http://localhost:5173"
    }
})



// // ----get prev task from db
// app.get("/api/task", async(req,res)=>{
//     try {
//         const tasks = await taskSchema.find()


//     } catch (error) {
        
//     }
// })





let allTask = []

io.on('connection',async(socket)=>{
    // console.log("a user connected: ", socket.id);

    // -----get initial task
    socket.on("getTask", async()=>{
        try {
    const initialTasks = await Task.find();

    allTask = initialTasks
    socket.emit('taskClient', allTask);

  } catch (error) {
    socket.emit('Failed to fetch initial tasks');
  }
    })


//   -----create task
  socket.on('create_task', async (data) => {
    try {
        const {title, description} = data
      const newTask = await taskSchema.create({
        title,
        description
      });

      allTask.push(newTask)
      io.emit('taskClient', allTask);
    } catch (error) {
      socket.emit('Failed to create task');
    }
  });



  // ----- Update Task
  socket.on('update_task', async (data) => {
    try {
      const { id, title, description, completed } = data;
      const updatedTask = await taskSchema.findByIdAndUpdate(
        id,
        { title, description, completed },
        {returnDocument: "after"}
      );
      
      if (updatedTask) {
        const taskList = await taskSchema.find()
        allTask = taskList
        io.emit('taskClient', allTask);
      }
    } catch (error) {
      socket.emit('Failed to update task');
    }
  });



  // ----- Delete Task
  socket.on('delete_task', async (id) => {
    try {
      await taskSchema.findByIdAndDelete(id);
      const taskList = await taskSchema.find()
        allTask = taskList
        io.emit('taskClient', allTask);

    } catch (error) {
      socket.emit('Failed to delete task');
    }
  });







    // socket.on("task",(value)=>{
    //     // console.log(value);
    //     allTask.push(value)
    //     io.emit("taskClient", allTask)
    // })


    // io.emit("taskClient", allTask)
    
    socket.on('disconnect', (dis)=>{
        // console.log("disconnected", socket.id);
        
    })
})

server.listen(8000, ()=>{
    dbConfig()
    console.log("runnng  ");
})
