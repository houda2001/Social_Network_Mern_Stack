const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const Profile = require("../../models/profile");

//GET MY PROFILE
//ACCESS PRIVATE
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );
    if (!profile) {
      res.send(404).json({ msg: "No such profile" });
    }
  } catch (error) {
    console.error(error);
    res.json({ msg: "Server Error" });
  }
});



router.post(
  "/",
    auth,
      check("status", "You're status is required").notEmpty(),
      check("skills", "Skills are required").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // destructure the request
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
    } = req.body;

    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (status) profileFields.status = status;
    if (bio) profileFields.bio = bio;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    //Update the profileFields if the profile exist

    let profile = await Profile.findOne({ user: req.user.id });
    try {
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile)

    } catch (error) {
      console.error(error)
    }
  }
);

router.get('/all',
auth,
async(req,res)=>{
  const profiles =await Profile.find()
  try {
    if(!profiles){
      res.status(404).json({msg:"No profile was created"})
    }
    res.status(200).json(profiles)
  } catch (error) {
    console.error(error);
    res.status(500).json({msg:"Server error"});
  }

}
)

module.exports=router