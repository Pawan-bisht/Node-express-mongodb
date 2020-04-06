require("../db/mongoose");
const User = require("../models/user");
//5e878429dee0a25c306410e9


    // User.findByIdAndUpdate("5e86f0113a92b23dc064ad14",{ age : 1 })
    // .then(result=>{
    //     console.log(result);
    //     return User.countDocuments({age : 1})
    // })
    // .then(fres=>{
    //     console.log(fres);
    // })
    // .catch(err=>{
    //     console.log(err);
    // })

    const updateAgeAndCount =async (id,age) =>{
        const user = await User.findByIdAndUpdate(id,{ age });
        const count = await User.countDocuments({ age });
        return {
            user,
            count
        };
    }

    updateAgeAndCount("5e86f0113a92b23dc064ad14",45)
    .then(data=>{
        console.log("We have data ",data);
    })
    .catch(err=>{
        console.log(err);
    })

