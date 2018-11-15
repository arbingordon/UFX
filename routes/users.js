var express = require('express');
var router = express.Router();
var auth = require("../controllers/AuthController.js");
var isLoggedIn = require("../middleware/auth");

var path = require('path');
var GridFsStorage = require('multer-gridfs-storage'); //gridFS
var crypto = require('crypto'); //generate filenames
var multer = require('multer'); //for gridFS

var mongoURI =  'mongodb://logins1:logins1@ds147073.mlab.com:47073/ufx_login';
//from https://github.com/devconcept/multer-gridfs-storage
// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});

//upload is a middleware and uploads data to db
const upload = multer({ storage }); //passing a storage engine

// route to register page
router.get('/register', auth.register);

// route for register action
router.post('/register', upload.single("file"), auth.doRegister);

// route to login page
router.get('/login', auth.login);

// route for login action
router.post('/login', auth.doLogin);

// route for logout action
router.get('/logout', auth.logout);

// route for user control panel
router.get('/settings', isLoggedIn, auth.usercp);

// GET edit user view
router.get('/edit/:id', isLoggedIn, auth.editUserView);

// UPDATE (edit user)
router.put('/edit/:id', isLoggedIn, upload.single("file"), auth.editUser);


module.exports = router;
