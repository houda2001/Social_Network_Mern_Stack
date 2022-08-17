const express =require('express');
const mongoose=require("mongoose");
const dotenv =require('dotenv')
const connectDB=require('./config/db')
dotenv.config()

const app =express();

const PORT= process.env.PORT || 5000;
app.use(express.json({extended:false}))

connectDB();
app.listen(PORT,()=>{console.log("server is running")});

app.use('/api/auth',require('./routes/api/auth'))
app.use('/api/users',require('./routes/api/users'))
app.use('/api/profile', require('./routes/api/profile'));
