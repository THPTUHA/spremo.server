import mongoose from 'mongoose';

export default ()=>{
    mongoose.connect('mongodb://localhost:27017/spremo',(err)=>{
        if(err){
            console.log("ERROR MONGO",err);
        }
        console.log("Connect mongodb");
    })
}