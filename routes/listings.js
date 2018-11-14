var express = require('express');
var router = express.Router();
var auth = require("../controllers/AuthController.js");
var isLoggedIn = require("../middleware/auth");

var path = require('path');
var GridFsStorage = require('multer-gridfs-storage'); //gridFS
var crypto = require('crypto'); //generate filenames
var multer = require('multer'); //for gridFS

var mongoURI =  'mongodb://logins1:logins1@ds147073.mlab.com:47073/ufx_login';
var listingsCtrl = require("../controllers/ListingsController.js");
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

// Search (for the search results)
router.get('/search/:criteria', listingsCtrl.search);
// GET route for add listing
router.get('/new', isLoggedIn, auth.addlisting);

// GET route for user control panel
router.get('/usercp', isLoggedIn, auth.usercp);

// CREATE route for add listing
router.post('/search', auth.search);

// CREATE route for add listing
router.get('/search', auth.search);

// CREATE route for add listing
router.post('/new', isLoggedIn, upload.single("file"), auth.postlisting);

// READ (individual listing page)
router.get('/:id', auth.viewListing);

// GET edit listing view
router.get('/edit/:id', isLoggedIn, auth.editListingView);

// UPDATE (edit listing)
router.put('/edit/:id', isLoggedIn, upload.single("file"), auth.editListing);

// DELETE route for listing
router.delete('/delete/:id', isLoggedIn, auth.deleteListing);

module.exports = router;