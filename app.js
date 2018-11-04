var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var methodOverride = require("method-override");
var crypto = require('crypto'); //generate filenames
var multer = require('multer'); //for gridFS
var GridFsStorage = require('multer-gridfs-storage'); //gridFS
var Grid = require('gridfs-stream');

let gfs;
var mongoURI =  'mongodb://logins1:logins1@ds147073.mlab.com:47073/ufx_login';
mongoose.Promise = global.Promise;
mongoose.connect(mongoURI)
  .then(function() {
    gfs = Grid(mongoose.connection.db, mongoose.mongo);
    gfs.collection('uploads');
    console.log('connection succesful')
  })
  .catch((err) => console.error(err));

  

var index = require('./routes/index');
var users = require('./routes/users');
var listings = require('./routes/listings');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));


app.use(function(req, res, next) {
  res.locals.user = req.user || null;
  next();
})

//https://github.com/aheckmann/gridfs-stream
// @route GET /image/:filename
// @desc Display Image
app.get('/uploads/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    // Check if image
    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      // Read output (image) to browser
      //create read stream
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
  });
});

app.use('/', index);
app.use('/users', users);
app.use('/listings', listings);

// passport configuration
var User = require('./models/User');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
