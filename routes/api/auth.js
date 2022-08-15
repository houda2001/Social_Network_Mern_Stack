const express=require('express');
const router=express.Router();
const auth = require('../../middleware/auth')
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

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

//LOGIN 

router.post(
    "/",
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const {email, password } = req.body;
      try {

        //see if the user exist
        let user = await User.findOne({ email });
        if (!user) {
          return res.status(404).json({ errors: [{ msg: "No such a user with this email" }] });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        //check if the password is valid
        if(!isMatch)
        {
          res.status(400).json({msg:'Password is not valid'})  
        }
         //send the jwt to the user
        const payload={
          user:{
            id:user.id
          }
        };
        jwt.sign(payload,
        process.env.JWT_SECRET_KEY,
        {expiresIn:360000},
        (err,token)=>{
        if(err) throw err;
        res.json({token})
        }
        );
        
      } catch (err) {
        console.log(err.message);
        res.status(500).send("server error");
      }
    }
  );

module.exports=router;