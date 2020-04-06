const express = require("express");
const User = require("./models/user");
const Task = require("./models/task");
require("./db/mongoose");

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.post("/task",async (req,res)=>{
    let task = new Task(req.body);
    
    //As the await resolve our promise for us We dont need to explicitly resolve it
    //So now that we have this in place we have refactor it out they need to use 
    //extra callbacks for all of

    //our functions.
    
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

app.get("/tasks",async (req,res)=>{
    try{
        const tasks = await Task.find({});
        res.send(tasks);
    }
    catch(e)
    {
        res.status(400).send(e);
    }
    // Task.find({})
    // .then(task=>{
    //     res.send(task);
    // })
    // .catch(err=>{
    //     res.status(500).send();
    // })
})

app.get("/task/:id",async (req,res)=>{
    let _id = req.params.id;

    try{
        const task = await Task.findById({_id});
        if(!task)
        {
            res.status(404).send();
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



app.post("/user",async (req,res)=>{
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

app.get("/users/:id",async (req,res)=>{
    
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

app.get("/users",async (req,res)=>{
    
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


app.listen(port,()=>{
    console.log("server running at 3000");
})