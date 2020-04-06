require("../db/mongoose");
const Task = require("../models/task");

// Task.findByIdAndRemove("5e86f5bf4e31e42690e451e4")
// .then(res=>{
//     console.log(res);
//     return Task.countDocuments({completed:false})
// })
// .then(data=>{
//     console.log(data);
// })
// .catch(err=>{
//     console.log(err);
// })

//5e862ff7869854a790183111

const taskFindAndDelete = async (id, completed) =>{
    const user = await Task.findByIdAndDelete(id);
    const count = await Task.countDocuments({ completed:false });
    return {
        user,
        count
    };
}

taskFindAndDelete("5e86f5d754af1031e079521a",false)
.then(res=>{
    console.log("we have this",res);
})
.catch(err=>console.log(err));