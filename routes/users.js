const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController")

router.post('/join', userController.join_post);

module.exports = router;
