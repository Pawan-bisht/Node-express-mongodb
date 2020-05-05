const express = require("express");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
require("./db/mongoose");

const app = express();

const port = process.env.PORT || 3000;

app.use((req, res, next) =>{
    return res.status(503).send("Our Site is in a mintinence phase!!!");
   
})


app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

const bcrypt = require("bcrypt");

const hashedPassword = async () =>{
    const password = "Red@1234";
    const genSalt = await bcrypt.genSalt(10);
    console.log(genSalt);
    const hashPassword = await bcrypt.hash(password, genSalt);
    console.log(hashPassword);


    const plaintext = "Red@1234";
    const result = await bcrypt.hash(plaintext,genSalt);
    if(result === hashPassword)
        console.log("yes they are equal");
}

hashedPassword();


// const jwt = require("jsonwebtoken");

// const myFunction = async()=>{
//     const token = jwt.sign({ _id:"123abc"},"ironman",{ expiresIn:"7 hrs"});  //the secret need to be same for both
//     console.log(token);
//     const data = jwt.verify(token, "ironman");
//     console.log(data);
// }

// myFunction();

app.listen(port,()=>{
    console.log("server running at ",port);
})