require("dotenv").config()

const asyncHandler = require("express-async-handler");
const {body, validationResult} = require("express-validator");

const User = require("../models/user");

exports.join_post = asyncHandler ( async (req, res, next) => {
  const status = req.body.status;
  const passcode = req.body.passcode;
  const user = req.user;

  if (status === 'member' && passcode === process.env.MEMBER_PASSCODE) {
    user.isMember = true;
    console.log(user)
    await User.findByIdAndUpdate(user._id, user, {});
    res.redirect('/')      
  } else if (status === 'admin' && passcode === process.env.ADMIN_PASSCODE) {
    user.isMember = true;
    user.isAdmin = true;
    await User.findByIdAndUpdate(user._id, user, {});
    res.redirect('/')   
  } else {
    res.send("wrong passcode")
  }
   
})