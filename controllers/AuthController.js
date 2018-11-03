var mongoose = require("mongoose");
var passport = require("passport");
var User = require("../models/User");
var Listing = require("../models/Listing");

var userController = {};

// Restrict access to root page
userController.home = function(req, res) {
  Listing.find({}, function (err, listings) {
    if (err) console.log(err);
    else res.render("index", { listings: listings });
  });
};

// Go to registration page
userController.register = function(req, res) {
  res.render('register');
};

// Post registration
userController.doRegister = function(req, res) {
  User.register(new User({ username : req.body.username, name: req.body.name }), req.body.password, function(err, user) {
    if (err) {
      return res.render('register');
    }

    passport.authenticate('local')(req, res, function () {
      res.redirect('/');
    });
  });
};

// Go to login page
userController.login = function(req, res) {
  res.render('login');
};

// Go to user control panel
userController.usercp = function(req, res) {
  res.render('usercp');
};

// Go to add listing
userController.addlisting = function(req, res) {
  res.render('addlisting');
};

// Post new Listing
userController.postlisting = function(req, res) {
  var newListing = req.body.listing;
  newListing.tags = newListing.tags.split(',');
  console.log(req.body);
  Listing.create(newListing, function(err, listing) {
    if(err){
      console.log(err);
      res.redirect('/listings/new');
    } else {
      res.redirect('/');
    }
  });
}

userController.deleteListing = function(req, res) {
  Listing.findOneAndRemove({ _id: req.params.id }, function (err) {
    if (err) { console.log(err); res.redirect("/"); }
    else {
        res.redirect("/");
    }
});
} 

// Post login
userController.doLogin = function(req, res) {
  passport.authenticate('local')(req, res, function () {
    res.redirect('/');
  });
};

// logout
userController.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

module.exports = userController;
