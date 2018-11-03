var express = require('express');
var router = express.Router();
var auth = require("../controllers/AuthController.js");
var isLoggedIn = require("../middleware/auth");

// GET route for add listing
router.get('/new', isLoggedIn, auth.addlisting);

// CREATE route for add listing
router.post('/new', isLoggedIn, auth.postlisting);

// TODO: READ (individual listing page)

// TODO: UPDATE (edit listing)

// DELETE route for listing
router.delete('/delete/:id', isLoggedIn, auth.deleteListing);

module.exports = router;