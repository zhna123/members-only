const asyncHandler = require("express-async-handler");
const {body, validationResult} = require("express-validator");
const Message = require("../models/message")

exports.message_create_get = asyncHandler(async(req, res, next) => {
  res.render("message-create-form", {
    title: "Create New Message"
  })
})

exports.message_create_post = [
  body("title")
  .trim()
  .isLength({min: 1, max: 50})
  .escape()
  .withMessage("Title needs to be between 1 to 50 characters"),

  body("content")
  .trim()
  .isLength({min: 1, max: 300})
  .escape()
  .withMessage("Content needs to be between 1 to 300 characters"),

  asyncHandler(async(req, res, next) => {
    const errors = validationResult(req);
    const message = new Message({
      title: req.body.title,
      text: req.body.content,
      date_created: Date.now(),
      user: req.user._id
    })
    if(!errors.isEmpty()) {
      res.render("message-create-form", {
        title: "Create New Message",
        message: message,
        errors: errors.array()
      })
    } else {
      await message.save()
      res.redirect('/')
    }
  })
]

exports.message_delete_get = asyncHandler(async(req, res, next) => {
  const message = await Message.findById(req.params.id).exec();
  res.render("message-delete-form", {
    title: "Delete Message",
    message: message
  })
})

exports.message_delete_post = asyncHandler(async(req, res, next) => {
  await Message.findByIdAndRemove(req.body.messageid);
  res.redirect("/")
})