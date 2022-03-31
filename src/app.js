//Importing packages
const express = require('express')
const morgan = require('morgan')
require('./db/mongoose.js')
const taskRouter = require('./Router/Task')
const userRouter = require('./Router/User')

//initiate express
const app = express()


//Creating Logs
if(process.env.NODE_ENV){
    app.use(morgan('dev'))
}

//use Json and routers
app.use(express.json())
app.use(userRouter, taskRouter)

module.exports = app