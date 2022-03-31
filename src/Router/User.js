//Improting required Lib
const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const {welcomeEmail, leaveEmail}= require('../emails/account') 

//middleware to check image size and type
const upload = multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('please upload an Image'))
        }
        cb(undefined, true)
    }
})

//User Routes

//Register a user
router.post('/users',async (req,res)=>{
    const user = new User(req.body)
    try{
        const token = await user.generateAuthToken()
        welcomeEmail(user.email, user.name)
        await user.save()
        res.status(201).send({user, token})
    }catch(e){
        console.log(e)
        res.status(400).send(e)
    }
})
//Sign in
router.post('/users/login', async (req,res) => {
    try{
        const user = await User.findByCredintials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.send({user,token})
    }catch(e){
        res.status(400).send()
    }
})
//LogOut
router.post('/users/logout',auth, async (req, res, next) =>{
    try{
        req.user.tokens = req.user.tokens.filter((token) =>{
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    }catch(e){
        res.status(500).send()
    }

})
//Logout from all devices
router.post('/users/logoutall',auth, async (req, res, next) =>{
    try{
        req.user.tokens = req.user.tokens =[]
        await req.user.save()

        res.send()
    }catch(e){
        res.status(500).send()
    }

})


//Read All users
router.get('/users',auth, async (req, res) =>{
    try{
        const users = await User.find({})
        res.send(users)
    }catch(e){
        res.status(500).send()
    }
})

router.get('/users/:id',async (req, res) =>{
    const _id = req.params.id
    try{
        const user = await User.findById(_id)
        if(!user){
            return res.status(404).send('Couldnt find user')
        }
        res.send(user)
    }catch(e){
        res.status(500).send()
    }
})

//Edit User Information
router.patch('/users/me',auth ,async (req, res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const ivalidOperation = updates.every((updates)=> allowedUpdates.includes(updates)) 
    if(!ivalidOperation){
        return res.status(400).send({error:"Invalid Updates"})
    }
    try{
        updates.forEach((update) => req.user[update] = req.body[update])
        
        await req.user.save()
        res.send(req.user)
    }catch(e){
        res.status(400).send()
    }
})

//Delete User
router.delete('/users/me',auth, async (req,res)=>{
    try{
        const user = req.user

        leaveEmail(user.email, user.name)
        await user.remove()
        res.send(user)
    }catch(e){
        res.status(500).send(e)
    }
})

//Upload Avatar
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req,res) => {
    const buffer = await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error,req,res,next) => {
    res.status(400).send({error:error.message})
})

//Delete Avatar
router.delete('/users/me/avatar', auth, async (req,res) =>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

//view avatar
router.get('/users/:id/avatar', async (req, res) =>{
    try{
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type','image/jpg')
        res.send(user.avatar)
    }catch(e){
        res.status(404).send()
    }
})

module.exports = router