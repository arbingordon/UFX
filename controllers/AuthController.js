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
  Listing.find({user: req.user.id}, function (err, listings) {
    if (err) console.log(err);
    else res.render('usercp', { listings: listings });
  });
};

// Go to add listing
userController.addlisting = function(req, res) {
  res.render('addlisting');
};

// Post new Listing
userController.postlisting = function(req, res) {
  var newListing = req.body.listing;
  newListing.file = "/uploads/" + req.file.filename;
  newListing.tags = newListing.tags.split(',');
  newListing.user = req.user.id;
  Listing.create(newListing, function(err, listing) {
    if(err){
      console.log(err);
      res.redirect('/listings/new');
    } else {
      res.redirect('/');
    }
  });
}

// View listing
userController.viewListing = function(req, res) {
  Listing.findById(req.params.id).populate('user').exec(function(err, listing) {
    console.log(listing);
    if (err) { console.log(err); res.redirect("/"); }
    else { res.render("listing", {listing: listing}) }
  });
}

// View Edit listing
userController.editListingView = function(req, res) {
  Listing.findById(req.params.id, function(err, listing) {
    if (err) { console.log(err); res.redirect("/"); }
    else { res.render("editlisting", {listing: listing}) }
  });
}

// Update listing
userController.editListing = function(req, res) {
  var updatedListing = req.body.newListing;
  updatedListing.tags = updatedListing.tags.split(',');
  if (req.file){
    updatedListing.file = "/uploads/" + req.file.filename;
  }
  Listing.findByIdAndUpdate(req.params.id, updatedListing, function(err, listing) {
    if (err) { console.log(err); res.redirect("/"); }
    else { res.redirect("/listings/"+req.params.id) }
  });
}

// Delete Listing
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
