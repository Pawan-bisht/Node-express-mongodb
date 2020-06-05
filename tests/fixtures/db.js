const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../src/models/user");
const Task = require("../../src/models/task");


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


let userTwoId = new mongoose.Types.ObjectId();
let userTwo = {
    _id: userTwoId,
    name: "Radhe jrishna",
    email: "radhe.krishna@gmail.com",
    password: "Samsung$1234",
    tokens: [{
        token: jwt.sign({
            _id: userTwoId._id
        }, process.env.JWT_SECRET_KEY)
    }]
}


let taskOneId = new mongoose.Types.ObjectId();
let taskOne = {
    _id: taskOneId,
    description: "Get a MERN stack job",
    completed: false,
    owner: userOneId
}

let taskTwoId = new mongoose.Types.ObjectId();
let taskTwo = {
    _id: taskTwoId,
    description: "Get a MERN stack 2nd job",
    completed: false,
    owner: userOneId
}

let taskThreeId = new mongoose.Types.ObjectId();
let taskThree = {
    _id: taskThreeId,
    description: "Get a MERN stack 3rd job",
    completed: false,
    owner: userTwoId
}

const setupDatabase = async () => {
    await User.deleteMany();
    await Task.deleteMany();
    await new User(userOne).save();
    await new User(userTwo).save();
    await new Task(taskOne).save();
    await new Task(taskTwo).save();
    await new Task(taskThree).save();
}

module.exports = {
    userOne,
    userOneId,
    userTwoId,
    userTwo,
    taskOne,
    taskOneId,
    setupDatabase
}