const express = require("express");
const Task    = require("../models/task");
const router  = express.Router();
const auth    = require("../middleware/auth");

router.post("/task", auth, async (req,res)=>{
    // let task = new Task(req.body);
    
    //As the await resolve our promise for us We dont need to explicitly resolve it
    //So now that we have this in place we have refactor it out they need to use 
    //extra callbacks for all of

    //our functions.
    
    const task = new Task({
        ...req.body,
        owner : req.user._id
    })

    try{
        await task.save();
        res.status(201).send(task);        
    } catch(e)
    {
        res.status(400).send(e);
    }
    

    // task.save()
    // .then(data=>{
    //     res.status(201);
    //     res.send(data);
    // })
    // .catch(err=>{
    //     res.status(400);
    //     res.send(err);
    // })
    
})

router.get("/tasks", auth, async (req,res)=>{
    const match = {};

    if(req.query.completed)
    {
        match.completed = req.query.completed === 'true';
    }
    //console.log("WE are matched",match);
    try{
        // const tasks = await Task.find({});
        // await req.user.populate("tasks").execPopulate();
        await req.user.populate({
            path : 'tasks', 
            match
        }).execPopulate();

        res.send( { tasks: req.user.tasks } );
    }
    catch(e)
    {
        res.status(500).send(e);
    }
    // Task.find({})
    // .then(task=>{
    //     res.send(task);
    // })
    // .catch(err=>{
    //     res.status(500).send();
    // })
})

router.get("/task/:id", auth, async (req,res)=>{
    let _id = req.params.id;

    try{
        //const task = await Task.findById({_id});
        const task = await Task.findOne({ _id, owner : req.user._id})
        if(!task)
        {
            return res.status(404).send();
        }
        res.send(task);
    }
    catch(e)
    {
        res.status(400).send(e);
    }
    // Task.findById({_id})
    // .then(task=>{
    //     if(!task)
    //     return res.status(404).send();

    //     res.send(task);
    // })
    // .catch(err=>{
    //     res.status(501).send(err);
    // })
})

router.patch("/tasks/:id", auth, async (req,res)=>{
        let _id = req.params.id;
        let updates = Object.keys(req.body);
        const allowedUpdates = ["completed", "description"];
        let isValid = updates.every(update=>allowedUpdates.includes(update));
        if(!isValid)
            return res.status(400).send({e :"INVALID UPDATES"});
        try{
            //let task = await Task.findByIdAndUpdate(_id,req.body,{ new:true, runValidators:true});
            const task = await Task.findOne({ _id, owner : req.user._id});
                        
            if(!task)
                return res.status(404).send();
            
            updates.forEach((update)=>{
                task[update] = req.body[update];
                });
            
            await task.save();
        
            res.send(task);    
        }
        catch(e)
        {
            res.status(500).send(e);
        }    
})

router.delete("/tasks/:id", auth, async( req,res)=>{
    let _id = req.params.id;
    try{
        // let task = await Task.findByIdAndDelete(_id);
        let task = await Task.findOneAndDelete({ _id, owner: req.user._id});
        if(!task)
            return res.status(404).send();
        res.send(task);  
    }
    catch(e)
    {
        console.log(e);
        res.status(500).send(e);
    }
    
})

module.exports = router;