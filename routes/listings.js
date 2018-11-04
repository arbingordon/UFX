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


// GET route for add listing
router.get('/new', isLoggedIn, auth.addlisting);

// CREATE route for add listing
router.post('/new', isLoggedIn, upload.single("file"), auth.postlisting);

// TODO: READ (individual listing page)
router.get('/:id', auth.viewListing);

// TODO: UPDATE (edit listing)

// DELETE route for listing
router.delete('/delete/:id', isLoggedIn, auth.deleteListing);

module.exports = router;