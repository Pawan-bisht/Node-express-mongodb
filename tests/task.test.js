const request = require('supertest');
const app = require("../src/app");
const Task = require("../src/models/task");
const {
    userOneId,
    userTwoId,
    userOne,
    userTwo,
    taskOneId,
    taskOne,
    setupDatabase
} = require("./fixtures/db");

beforeEach(setupDatabase)

test("Should create task for user", async () => {
    console.log(userOne)
    const response = await request(app)
        .post('/task')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'From my test'
        })
        .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toBe(false)
})

test("Should get tasks for valid user", async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body.tasks.length).toEqual(2);
})

test("Should not delete task by invlaid user", async () => {
    const response = await request(app)
        .delete(`/task/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .expect(404)
})