//Improting required Lib
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

//Create a user before testing
const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: "First User",
    email: "First@user.co",
    password:'123123',
    tokens: [{
        token: jwt.sign({_id: userOneId},process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: "Seconde User",
    email: "Second@user.co",
    password:'123123',
    tokens: [{
        token: jwt.sign({_id: userTwoId}, process.env.JWT_SECRET)
    }]
}

//Create tasks before testing
const taskOne={
    _id: new mongoose.Types.ObjectId(),
    descreption: "First task",
    completed:false,
    owner: userOneId
}

const taskTwo={
    _id: new mongoose.Types.ObjectId(),
    descreption: "Second task",
    completed:true,
    owner: userOneId
}

const taskThree={
    _id: new mongoose.Types.ObjectId(),
    descreption: "third task",
    completed:false,
    owner: userTwoId
}



const setUpDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    userOne,
    userOneId,
    setUpDatabase,
    taskOne,
    userTwo
}