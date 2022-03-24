//Importing packages
const express = require('express')
const morgan = require('morgan')
require('./db/mongoose.js')
const taskRouter = require('./Router/Task')
const userRouter = require('./Router/User')

//initiate express
const app = express()
app.use((req, res, next) =>{
    console.log(req.method,req.path)
    next()
})

//Creating Logs
if(process.env.NODE_ENV){
    app.use(morgan('dev'))
}


//use Json and routers
app.use(express.json())
app.use(userRouter, taskRouter)


//Create port
const port = process.env.PORT || 4000

app.listen(port, ()=>{
    console.log("Listening on http://localhost:"+port)
})
