const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:[true, "Name of the user required"]
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        validate:(value)=>{
            if(!validator.isEmail(value))
            throw new Error ("Email is invalid");
        }
    },
    age:{
        type:Number,
        default:null,
        
        validate:(value)=>{
            if(value<0)
            {
                throw new Error("Age must be greater than 1");
            }
        }
    },
    password:{
        type:String,
        trim:true,
        required:true,
        validate:(value)=>{
            if(value.toLowerCase().includes("password"))
            throw new Error("Password cant be password");

            if(!validator.isLength(value,{min:8}))
            throw new Error("Password length must be atleast 8 characters");
        }
    }
})          

userSchema.statics.findByCredentials = async(email, password)=>{
    const user = await User.findOne({ email });
    if(!user)
    {
        throw new Error("Unable to login!");
    }
    console.log("user:  ",email);

    let isMatch = await bcrypt.compare(password,user.password);
    console.log(isMatch);
    if(!isMatch)
    {
        throw new Error("Email or Password is Invalid");
    }
    
    return user;

}

userSchema.pre('save',async function(next){
    const user = this;
    if(user.isModified("password"))
    {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})

const User = new mongoose.model('User',userSchema);   

module.exports = User;
