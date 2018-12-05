var mongoose = require("mongoose");
var passport = require("passport");
var User = require("../models/User");
var Listing = require("../models/Listing");
var fetch = require("fetch");
var convertXML = require('xml-js');
let request = require('request');


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
  var newUser = req.body.newUser;
  if(req.file) {
    newUser.image = "/uploads/" + req.file.filename;
  } else {
    newUser.image = "/uploads/cdbd82095c481b310c15ac4b1b130ce6.png";
  }
  request({
    url: "http://scr.im/xml/email=" + newUser.email,
    method: "POST",
    body: ""
    }, function (error, resp, body){
      if (error) {console.log(error)}
       _json = JSON.parse(convertXML.xml2json(body, {compact: true}));
       newUser.emailurl = _json.scrim.url._text;
       console.log(newUser);
       User.register(new User(newUser), newUser.password, function(err, user) {
        if (err) {
          console.log(err);
          return res.render('register');
        } else {
          res.redirect('loginAfterRegister');
        }
        // passport.authenticate('local')(req, res, function () {
        //   res.redirect('/');
        // });
      });
  });
};

// Go to login page
userController.login = function(req, res) {
  res.render('login');
};

// Go to loginAfterRegister page
userController.loginAfterRegister = function(req, res) {
  res.render('loginAfterRegister');
};

// Go to user control panel
userController.usercp = function(req, res) {
  Listing.find({user: req.user.id}, function (err, listings) {
    if (err) console.log(err);
    else {
      res.render('usercp', { listings: listings });
    }
  });
};


// Search
userController.search = function(req, res) {
  Listing.find({tags: req.body.query}, function (err, listings) {
    if (err) console.log(err);
    else res.render('search', { oldquery: req.body.query, listings: listings });
  });
};

// Go to add listing
userController.addlisting = function(req, res) {
  res.render('addlisting');
};

// Post new Listing
userController.postlisting = function(req, res) {
  var newListing = req.body.listing;
  if(req.file)
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

// View Edit user
userController.editUserView = function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (err) { console.log(err); res.redirect("/"); }
    else { res.render("edituser", {user: user}) }
  });
}

// Update user
userController.editUser = function(req, res) {
  var updatedUser = req.body.newUser;
  if (req.file){
    updatedUser.image = "/uploads/" + req.file.filename;
  }
  request({
    url: "http://scr.im/xml/email=" + updatedUser.email,
    method: "POST",
    body: ""
    }, function (error, resp, body){
      if (error) {console.log(error)}
       _json = JSON.parse(convertXML.xml2json(body, {compact: true}));
       console.log(_json.scrim.url._text);
       updatedUser.emailurl = _json.scrim.url._text;
       console.log(updatedUser.emailurl);
       User.updateOne({_id: req.params.id}, updatedUser, function(err, user) {
        if (err) { console.log(err); res.redirect("/"); }
        else { res.redirect("/users/settings");}
      });
  });
};

module.exports = userController;
