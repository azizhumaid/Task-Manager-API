//Improting required Lib
const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {userOne, userOneId, setUpDatabase} = require('./fixtures/db')

beforeEach(setUpDatabase)

test('Should Signup new user', async () =>{
  const response = await request(app).post('/users').send({
        name:'Aziz',
        email:'azizhumaid96@gmail.com',
        password: '000000'
    }).expect(201)

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    expect(response.body).toMatchObject({
        user:{
            name:'Aziz',
            email:'azizhumaid96@gmail.com'
        },
        token: user.tokens[0].token
    })
})

test('Should Login existing user', async () =>{
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not Login non-existing user',async ()=>{
    await request(app).post('/users/login').send({
        email: 'aziz@gg.co',
        password: '123123'
    }).expect(400)
})

test('Should not get profile for user',async ()=>{
    await request(app).get('/users')
    .send()
    .expect(401)
})

test('Should delete profile for user',async ()=>{
 const response =  await request(app).delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delete profile for user',async ()=>{
    await request(app).delete('/users/me')
    .send()
    .expect(401)
})

test('Should upload avatar photo', async ()=>{
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid User Fields', async ()=>{
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Khaled',
            age: 23
        })
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.name).toEqual('Khaled')

})

test('Should not update invalid User Fields', async ()=>{
    await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        City: 'Khaled'
    })
    .expect(400)
})