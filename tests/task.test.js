//Improting required Lib
const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../src/app')
const Task = require('../src/models/task')

const {userOne, userOneId, setUpDatabase, taskOne, userTwo} = require('./fixtures/db')

beforeEach(setUpDatabase)

test('Should create task for user',async ()=>{
    const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        descreption: "Create task test"
    })
    .expect(200)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toBe(false)

})

test('Should get all tasks for a user', async () =>{
    const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    expect(response.body.length).toEqual(2)

})


test('Should not delete a task for a different user', async ()=>{
    const response = await request(app)
    .delete('/tasks')
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .set('id', taskOne._id)
    .send()
    .expect(404)
})