const asyncHandler = require("express-async-handler");
const {body, validationResult} = require("express-validator");
const Message = require("../models/message")

const bcrypt = require("bcryptjs")
const User = require("../models/user");

exports.index = asyncHandler(async(req, res, next) => {
  const allMessages = await Message.find().populate('user').sort({date_created: -1}).exec();
  res.render("index", {
    title: "MembersOnly",
    message_list: allMessages
  })
})

exports.user_signup_get = asyncHandler(async(req, res, next) => {
  res.render("sign-up-form", {
    title: "Create An Account"
  })
})

exports.user_signup_post = [
  // validate and sanitize fields
  body("first")
  .trim()
  .isLength({min: 1})
  .escape()
  .withMessage("First name is required"),

  body("last")
  .trim()
  .isLength({min: 1})
  .escape()
  .withMessage("Last name is required"),

  body("email")
  .isEmail()
  .withMessage("Need a valid email address"),

  body("pwd")
  .trim()
  .isLength({min: 1})
  .escape()
  .withMessage("Password is required"),

  body("passwordConfirmation")
  .custom((value, {req}) => {
    return value === req.body.pwd
  })
  .withMessage("Password does not match"),

  asyncHandler(async(req, res, next) => {
    const errors = validationResult(req);

    const user = new User({
      first_name: req.body.first,
      last_name: req.body.last,
      email: req.body.email,
    });
    if (!errors.isEmpty()) {
      res.render("sign-up-form", {
        title: "Create An Account",
        user: user,
        errors: errors.array()
      });
      return 
    } else {
      const userExists = await User.findOne({email: req.body.email}).exec()
      if (userExists) {
        res.render("sign-up-form", {
          title: "Create An Account",
          user: user,
          userExists: true
        })
      } else {
        bcrypt.hash(req.body.pwd, 10, async (err, hashedPassword) => {
          if (err) {
            console.log("encrypt password failed!")
            return next(err);
          } else {
            user.password = hashedPassword;
            await user.save();
            res.redirect("/success")
          }
        })
      }
    }
  })
]
