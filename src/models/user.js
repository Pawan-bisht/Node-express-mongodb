const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Task = require("./task");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Name of the user required"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: (value) => {
            if (!validator.isEmail(value))
                throw new Error("Email is invalid");
        }
    },
    age: {
        type: Number,
        default: null,

        validate: (value) => {
            if (value < 0) {
                throw new Error("Age must be greater than 1");
            }
        }
    },
    password: {
        type: String,
        trim: true,
        required: true,
        validate: (value) => {
            if (value.toLowerCase().includes("password"))
                throw new Error("Password cant be password");

            if (!validator.isLength(value, {
                    min: 8
                }))
                throw new Error("Password length must be atleast 8 characters");
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer //For binary data we want to access to
    }
}, {
    timestamps: true
})

//For reverse backtraking of user to task, we use virutal functions
//This will not stored in database but it will tell u the relationship with other table

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})


userSchema.methods.toJSON = function () {
    //  "toJSON" name is very signigicant because in this toJSON will giva a function to na object 
    // and can update or delete an object 
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;
    // user.password = undefined;
    // user.tokens = undefined;
    return userObject;
}

userSchema.methods.generateAuthToken = async function () {
    //This "methods" method applied on instances of object of model or instance methods
    const user = this;
    const token = jwt.sign({
        _id: user._id.toString()
    }, process.env.JWT_SECRET_KEY);
    user.tokens = user.tokens.concat({
        token
    });
    await user.save();
    return token;
}


userSchema.statics.findByCredentials = async (email, password) => {
    //This is a "static" method is applied/accessible on model sometimes called model methods
    // console.log(email,password);
    const user = await User.findOne({
        email
    });

    //User is the same name as the model name
    // console.log("We are inside of statics",user)
    if (!user) {
        throw new Error("Unable to login!");
    }

    let isMatch = await bcrypt.compare(password, user.password);
    // console.log(isMatch);
    // let res = isMatch === user.password;
    // console.log("the result is",res);
    if (!isMatch) {
        throw new Error("Email or Password is Invalid");
    }

    return user;
}

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})

userSchema.pre('remove', async function (next) {
    let user = this;
    await Task.deleteMany({
        owner: user._id
    });
    next();
})

const User = new mongoose.model('User', userSchema);

module.exports = User;