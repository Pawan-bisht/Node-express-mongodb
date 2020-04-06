const mongoose = require("mongoose");
const validator = require("validator");


const taskSchema = new mongoose.Schema({
    description:{
        type:String,
        required:[true,"Description is required to enter"],
        trim:true
    },
    completed:{
        type:Boolean,
        default:false,
    }
})

const TaskModel = new mongoose.model('Task',taskSchema);

module.exports = TaskModel;