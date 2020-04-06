const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api",
            {              
                useNewUrlParser: true, 
                useUnifiedTopology: true,
                useFindAndModify:false
            });




//  const me =  new User({
//      name:"Pawan kumar    ",
//      age:56,
//      password:"      Password$1234       ",
//      email:"pawan.kumar@gmail.com      "
//  });

//  me.save()
//  .then(res=>console.log(res))
//  .catch(err=>console.log(err))



// newTask.save()
// .then(res=>console.log(res))
// .catch(err=>console.log(err));
