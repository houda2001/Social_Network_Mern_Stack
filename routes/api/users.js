const express =require('express');
const router =express.Router();
const { check, validationResult } = require('express-validator');

router.post('/',
[
check('name','Name is required').not().isEmpty(),
check('email','Please include a valid email').isEmail(),
check('password','please include a password with minimum 6 characters').isLength({min:6})
],
(req,res)=>{
   const errors=validationResult(req);
   if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()})
   }
   res.send("user")
})
module.exports=router