var express = require('express');
var router = express.Router();
var auth = require("../controllers/AuthController.js");

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

// restrict index for logged in user only
router.get('/', auth.home);

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
router.get('/usercp', isLoggedIn, auth.usercp);

// route for add listing
router.get('/addlisting', isLoggedIn, auth.addlisting);

module.exports = router;
