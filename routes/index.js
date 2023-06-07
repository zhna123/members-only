var express = require('express');
var router = express.Router();

const indexController = require("../controllers/indexController")

/* GET home page. */
router.get('/', indexController.index);

router.get('/sign-up', indexController.user_signup_get);
router.post('/sign-up', indexController.user_signup_post);

router.get('/success', (req, res, next) => {
  res.render("sign-up-success", { title: 'Success'});
})

module.exports = router;
