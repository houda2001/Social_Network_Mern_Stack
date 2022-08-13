const express=require('express');
const router=express.Router();
const auth = require('../../middleware/auth')
const User = require("../../models/User");

//RETURN USER INFORMATIONS
router.get('/',
auth,
async(req,res)=>{
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    } catch (error) {
        console.error(error)
        res.status(500).json({msg:'Server Error'})
    }
})

module.exports=router;