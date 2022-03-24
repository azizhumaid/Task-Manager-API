const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const User = require('../models/user')
const router = new express.Router()

//Task Routs


//Get all tasks
router.get('/tasks',auth, async (req, res) =>{
    const match = {}
    const sort = {}
    if(req.query.completed){
        match.completed =req.query.completed ==='true'
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] ==='desc'? -1 : 1
    }
    console.log(match)
    try{
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
               
            }
         })
        res.send(req.user.tasks)
    }catch(e){
        console.log(e)
        res.status(500).send()
    }
})

router.get('/tasks/:id', auth, async (req, res) =>{
    const _id = req.params.id
    try{
        const task = await Task.findOne({_id, owner: req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})
router.patch('/tasks/:id',auth, async (req, res) =>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['descreption', 'completed']
    const ivalidOperation = updates.every((updates)=> allowedUpdates.includes(updates)) 
    if(!ivalidOperation){
        return res.status(400).send({error:"Invalid Updates"})
    }
    try{
        const task = await Task.findOne({_id : req.params.id, owner:req.user._id})
        // const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true,})
        if(!task){
            return res.status(404).send()
        }
        updates.forEach((update)=> task[update] = req.body[update])
        await task.save()
        res.send(task)
    }catch(e){
        console.log(e)
        res.status(400).send()
    }
})

router.post('/tasks',auth ,async (req, res)=>{
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try{
        task.save()
        res.send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth,async (req, res) =>{
    try{
        const task = await Task.findOneAndDelete({_id : req.params.id, owner:req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})

module.exports = router