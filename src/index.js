const express = require("express");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
require("./db/mongoose");

const app = express();

const port = process.env.PORT || 3000;

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


    const plaintext = "red@1234";
    const result = await bcrypt.compare(plaintext,hashPassword);
    console.log(result);
}

hashedPassword();
app.listen(port,()=>{
    console.log("server running at 3000");
})