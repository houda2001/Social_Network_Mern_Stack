const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
//@route  post  api/users
//@ desc  register user
//@access public(we don't need token for access)
//donc /api/users ca va etre ajouter a this slach
//   localhost:5000/api/users
router.post(
  "/",
  check("name", "Name is required").notEmpty(),
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

    const { name, email, password } = req.body;
    try {
      //see if the user exist

      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ errors: [{ msg: "User already exists" }] });
      }
      //get users gravatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      user = new User({
        name,
        email,
        password,
        avatar,
      });
      //encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      //return the jwt

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
module.exports = router;
