// const mongodb = require("mongodb");
// const mongoClient = mongodb.mongoClient;     //Used to connect with our mongo database

const { MongoClient, ObjectID } = require("mongodb"); 
let id = new ObjectID();
console.log(id);
console.log(id.getTimestamp())

const connectionURL = 'mongodb://127.0.0.1:27017';      //URL for connection
const databaseName = "task-manager";                    // Database name to connect with

MongoClient.connect(connectionURL,{ useNewUrlParser:true,useUnifiedTopology:true},(error,client)=>{      //Async operation to connect with database
    if(error)
    {
        return console.log("Unable to Connect with database!!!");
    }
    const db = client.db(databaseName);       //Get the reference of created  database
    
    db.collection('users').findOne({age:{$gt:23}},{limit:10},(error,result)=>{
        if(error)
            return console.log(error);
        
        console.log(result);
    })

    db.collection('users').find({age:{$gt:23}}).toArray((error,res)=>{
        if(error)
        return console.log(error);
        console.log(res);
    });
    

    db.collection('users').deleteOne({name:"Vikram"})
    .then(data=>console.log(data.deletedCount))
    .catch(err=>console.log(err));


    // db.collection('tasks').updateMany({completed:false},{$set:{completed:true}})
    // .then(data=>{
    //     console.log(data);
    // })
    // .catch(err=>{
    //     console.log(err);
    // })
    
    //db.collection('users').updateOne({age:60},{$set:{age:65}}).then(data=>console.log(data)).catch((err)=>console.log(err))
    
    
    // db.collection('users').insertOne({
        
    //     name:"Vikram",
    //     age:43
    // },(error,result)=>{
    //     if(error)
    //     return console.log(error);
    //     console.log(result.ops);
    // })


    
    // db.collection('users').insertMany([{
    //     name:"Ritu Bisht",
    //     age:27
    // }],(error,result)=>{
    //     if(error)
    //     return console.log("Error in insert opeation");
    //     console.log(result.ops);
    //     console.log(result.connection);
    // })
    // db.collection('tasks').insertMany([{
    //     description:"Brush your teeth",
    //     completed:true
    // },
    // {
    //     description:"Reading the books",
    //     completed:false
    // }],(error,result)=>{
    //     if(error)
    //     return console.log(error);
    //     console.log(result.ops);
    // })
})