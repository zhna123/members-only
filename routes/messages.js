const express = require("express");
const router = express.Router();

const messageController = require("../controllers/messageController")

router.get('/item/create', messageController.message_create_get);
router.post('/item/create', messageController.message_create_post);

router.get('/item/:id/delete', messageController.message_delete_get);
router.post('/item/:id/delete', messageController.message_delete_post);

// router.get('/', messageController.message_list_get)

module.exports = router