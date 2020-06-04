const request = require('supertest');
const app = require("../src/app");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../src/models/user");

let userOneId = new mongoose.Types.ObjectId();
let userOne = {
    _id: userOneId,
    name: "Hanuman",
    email: "mike@gmail.com",
    password: "Samsung$1234",
    tokens: [{
        token: jwt.sign({
            _id: userOneId._id
        }, process.env.JWT_SECRET_KEY)
    }]
}


beforeEach(async () => {

    await User.deleteMany()
    await new User(userOne).save();
})

// // afterEach(() => {
// //     console.log("After Each")
// // })


test("Should signup a new user", async () => {
    const response = await request(app).post('/user').send({
        name: "Obi wan",
        email: "pawanbisht83@gmail.com",
        password: "Samsung$1234"
    }).expect(201)

    //Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull()

    //Assertion about the response
    expect(response.body).toMatchObject({
        user: {
            name: "Obi wan",
            email: "pawanbisht83@gmail.com",
        },
        token: user.tokens[0].token
    })
})


test("should login existing user", async () => {
    const response = await request(app).post('/users/login').send({
            email: userOne.email,
            password: userOne.password
        })
        .expect(200)
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull()
    expect(response.body.token).toBe(user.tokens[1].token)
})

test("Should not login nonexistent user", async () => {
    await request(app).post('/users/login').send({
        email: "mike@gmail.com",
        password: "Samsung$123"
    }).expect(400)
})

test("should get profile for user", async () => {
    await request(app)
        .get('/user')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test("should not get profile for unauthenticated user", async () => {
    await request(app)
        .get('/user')
        .send()
        .expect(401)
})

test("should delete account for user", async () => {
    const response = await request(app)
        .delete('/users')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    console.log("should delete", response.body)
    const user = await User.findById(userOneId);
    expect(user).toBeNull()
})

test("should not delete account for unauthenticated user", async () => {
    await request(app)
        .delete('/users')
        .send()
        .expect(401)
})

test("should upload avatar image", async () => {
    console.log("we are in avatar")
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/node-course-images/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})


test("should update a valid user fields", async () => {
    const response = await request(app)
        .patch('/users')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: "Darth vador"
        })
        .expect(200)


    const user = await User.findById(userOneId);
    expect(user.name).toBe("Darth vador")
})

test("Should not update a invalid user field", async () => {
    await request(app)
        .patch('/users')
        .send({
            name: "Kaliya"
        })
        .expect(401)
})

test("Should not udpdate the valid users invalid fields", async () => {
    const response = await request(app)
        .patch('/users')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            height: 200

        }).expect(400)
})