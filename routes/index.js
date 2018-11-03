var express = require('express');
var router = express.Router();
var auth = require("../controllers/AuthController.js");
var isLoggedIn = require("../middleware/auth");

// restrict index for logged in user only
router.get('/', auth.home);

module.exports = router;
