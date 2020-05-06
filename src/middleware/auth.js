const jwt = require("jsonwebtoken");
const User = require("../models/user");
const auth = async (req, res,next) =>{
   
    try{
        const token = req.header("Authorization").replace("Bearer ",'');
        // console.log("Result we are at", token);
        const decodedToken = jwt.verify(token, "this-is-the-secret-key");
        const user = await User.findOne({ _id : decodedToken._id, 'tokens.token':token});
        console.log("WE are here",user);
        if(!user)
        {
            throw new Error("INVALID AUTH TOKEN");
        }
        req.token = token;
        req.user = user;
        next();
    }
    catch(e)
    {
        res.status(401).send({ error : "Please authenticate"});
    }
}

module.exports = auth;