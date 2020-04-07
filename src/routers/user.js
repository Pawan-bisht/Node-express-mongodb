const express =require("express");
const router = express.Router();
const User = require("../models/user");

router.post("/user",async (req,res)=>{
    console.log(req.body);
    let user = new User(req.body);
    try{
        await user.save();
        res.status(201).send(user);

    }
    catch(e)
    {
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

router.get("/users/:id",async (req,res)=>{
    
    let _id = req.params.id;

    try{
        const user = await User.findById(_id);
        if(!user)
        {
            return res.status(404).send();
        }
        res.send(user);
    }
    catch(e)
    {
        res.status(500).send(e);
    }

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
})

router.get("/users",async (req,res)=>{
    
    try{
        const users = await User.find({});
        res.send(users);
    }
    catch(e)
    {
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

router.patch("/users/:id",async (req,res)=>{
    let updates = Object.keys(req.body);
    const allowedUpdates = ["name", "age", "email", "password"];
    let isValid = updates.every(update=> allowedUpdates.includes(update));
    if(!isValid)
        return res.status(400).send({err:"INVALID UPDATES"});
    let _id = req.params.id;
    console.log(req.body);
    try{
        const user = await User.findByIdAndUpdate(_id,req.body,{ new:true, runValidators:true });
        console.log(user);
        if(!user)
            return res.status(404).send();    
        res.send(user);
    }
    catch(e){
        res.status(500).send(e);
    }
})

router.delete("/users/:id", async(req,res)=>{
    let _id = req.params.id;
    try{
        let user = await User.findByIdAndDelete(_id);
        if(!user)
            return res.status(404).send();
        res.send(user);
    }
    catch(e)
    {
        res.status(500).send(e);
    }
})


module.exports = router;