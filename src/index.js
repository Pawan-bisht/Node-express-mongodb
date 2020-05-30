const express = require("express");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
require("./db/mongoose");

const app = express();

const port = process.env.PORT;

// app.use((req, res, next) =>{
//     return res.status(503).send("Our Site is in a mintinence phase!!!");

// })

const multer = require("multer");
const upload = multer({
    dest: "images",
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(doc | docx)$/)) {
            return cb(new Error("Please upload a word document"));
        }
    }
})

const errorHandler = (req, res, next) => {
    throw new Error("Error!!!");
}

app.post("/upload", upload.single("upload"), (req, res) => {
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    });
})

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);



// const hashedPassword = async () =>{
//     const password = "Red@1234";
//     const genSalt = await bcrypt.genSalt(10);
//     console.log(genSalt);
//     const hashPassword = await bcrypt.hash(password, genSalt);
//     console.log(hashPassword);


//     const plaintext = "Red@1234";
//     const result = await bcrypt.hash(plaintext,genSalt);
//     if(result === hashPassword)
//         console.log("yes they are equal");
// }

// hashedPassword();


// const jwt = require("jsonwebtoken");

// const myFunction = async()=>{
//     const token = jwt.sign({ _id:"123abc"},"ironman",{ expiresIn:"7 hrs"});  //the secret need to be same for both
//     console.log(token);
//     const data = jwt.verify(token, "ironman");
//     console.log(data);
// }

// myFunction();

app.listen(port, () => {
    console.log("server running at ", port);
});


// const taskModel = require("./models/task");
// const userModel = require("./models/user");
// const main = async ()=>{
//     // const task = await taskModel.findById("5eb2faee0bc8ecf4f1959ef0");
//     // await task.populate("owner").execPopulate(); 
//     //  console.log(task);

//     const user = await userModel.findById("5eb2fa7c0bc8ecf4f1959eee");
//     await user.populate("tasks").execPopulate();
//     // console.log(user.tasks);
// }
// main();