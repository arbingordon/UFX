var express = require('express');
var router = express.Router();
var auth = require("../controllers/AuthController.js");
var isLoggedIn = require("../middleware/auth");

// route to register page
router.get('/register', auth.register);

// route for register action
router.post('/register', auth.doRegister);

// route to login page
router.get('/login', auth.login);

// route for login action
router.post('/login', auth.doLogin);

// route for logout action
router.get('/logout', auth.logout);

// route for user control panel
router.get('/settings', isLoggedIn, auth.usercp);

module.exports = router;
