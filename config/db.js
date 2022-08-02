const mongoose =require('mongoose');
const dotenv=require('dotenv').config();

const connectDB= async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL,{useNewUrlParser:true});
        console.log('DB is connected')
    } catch (error) {
        console.error(error.message);
        process.exit(1)
    }
}

module.exports=connectDB;