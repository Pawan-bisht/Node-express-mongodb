const express = require("express");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const authMiddleware = require("../middleware/auth");
const {
    sendWelcomeEmail,
    sendCancelationEmail
} = require('../emails/account')
const router = express.Router();
const sharp = require("sharp");
const User = require("../models/user");


const upload = multer({
    // dest : "avatar",   //dest property need to remove when we dealing with backend
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        //if(!file.originalname.endsWith(".pdf"))      // In this we can use regular expression
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error("Please upload a JPG or JPEG or PNG format file!"));
        }
        cb(undefined, true);
        //cb(new Error("File must be in pdf"))
        //cb(null or undfined, true)
        //cb(null or undefined, false)
    }
})

router.post("/user", async (req, res) => {

    let user = new User(req.body);
    try {
        sendWelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();
        console.log(jwt.verify(token, process.env.JWT_SECRET_KEY));
        res.status(201).send({
            user,
            token
        });
    } catch (e) {
        res.status(400).send(e);
    }
    // user.save()
    // .then(data=>
    //     {
    //         res.send(data);
    //     })
    // .catch(err=>{
    //     console.log(err);
    //     res.status(400);
    //     res.send(err);
    // })
})

// router.get("/users/:id",async (req,res)=>{

//     let _id = req.params.id;

//     try{
//         const user = await User.findById(_id);
//         if(!user)
//         {
//             return res.status(404).send();
//         }
//         res.send(user);
//     }
//     catch(e)
//     {
//         res.status(500).send(e);
//     }

// User.findById(_id)
// .then(data=>{
//     if(!data)
//         return res.status(404).send();
//     res.send(data);
// })
// .catch(err=>{
//     res.status(500);
//     res.send(err);
// })
// })

router.post("/users/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({
            user,
            token
        });
    } catch (e) {
        console.log(e);
        res.status(400).send(e.Error);
    }
})

router.post('/users/logout', authMiddleware, async (req, res) => {
    try {

        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();
        res.send({
            message: "Signed Out succesfully!!"
        });
    } catch (e) {
        req.status(500).send(e);
    }
})

router.post('/users/logoutAll', authMiddleware, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send({
            message: "All sesions are logout"
        });
    } catch (e) {
        res.status(501).send(e);
    }
})

router.get('/user', authMiddleware, async (req, res) => {

    res.send(req.user);
})

router.get("/users", authMiddleware, async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (e) {
        res.status(404).send(e);
    }

    // User.find({})
    // .then(data=>{
    //     res.send(data)
    // })
    // .catch(err=>{
    //     res.status(400);
    //     res.send(err);
    // })
})

router.patch("/users", authMiddleware, async (req, res) => {
    let updates = Object.keys(req.body);
    const allowedUpdates = ["name", "age", "email", "password"];
    console.log(updates);
    let isValid = updates.every(update => allowedUpdates.includes(update));

    if (!isValid)
        return res.status(400).send({
            err: "INVALID UPDATES"
        });


    try {
        //const user = await User.findByIdAndUpdate(_id,req.body,{ new:true, runValidators:true });

        // const user = await User.findById(_id);

        updates.forEach((update) => {
            req.user[update] = req.body[update];
        })
        await req.user.save();
        res.send(req.user);
    } catch (e) {
        res.status(500).send(e);
    }
})

router.delete("/users", authMiddleware, async (req, res) => {
    let _id = req.user._id;
    try {

        // let user = await User.findByIdAndDelete(_id); 
        // if(!user)
        //     return res.status(404).send();
        // res.send(user);

        await req.user.remove();
        sendCancelationEmail(req.user.email, req.user.name);
        res.send({
            user: req.user
        });
    } catch (e) {
        res.status(500).send(e);
    }
})

router.post('/users/me/avatar', authMiddleware, upload.single("avatar"), async (req, res) => {
    console.log("save");
    const buffer = await sharp(req.file.buffer).resize({
        width: 250,
        height: 250
    }).png().toBuffer();
    req.user.avatar = buffer; //modified Image
    await req.user.save();
    res.send();
}, (error, req, res, next) => { //Cutomizing Error in Express
    res.status(400).send(error.message);
})

router.delete("/users/me/avatar", authMiddleware, async (req, res) => {
    try {
        req.user.avatar = undefined;
        await req.user.save();
        res.status(200).send("Successfully deleted");
    } catch (e) {
        res.status(400).send("Can't deleted");
    }
})

router.get("/users/:id/avatar", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.avatar) {
            throw new Error();
        }
        res.set('Content-Type', 'image/png') //Setting header  default is app/json
        res.send(user.avatar);
    } catch (e) {
        res.status(400).send(e);
    }
})
module.exports = router;