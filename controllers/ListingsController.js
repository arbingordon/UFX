var mongoose = require("mongoose");
var passport = require("passport");
var Listing = require("../models/Listing");

var listingsController = {};


// View Edit listing
listingsController.search = function(req, res) {
  var criteria = req.params.criteria
    Listing.find({$or:[{"shortdesc": {$regex: new RegExp(criteria.replace(/\s+/g,"\\s+"), "gi")}}, {"tags": {$regex: new RegExp(criteria.replace(/\s+/g,"\\s+"), "gi")}}, {"longdesc": {$regex: new RegExp(criteria.replace(/\s+/g,"\\s+"), "gi")}}]}, function (err, listings) {
        if (err) console.log(err);
        else res.render("search-results", { listings: listings,searchCriteria: criteria });
      });
    //res.render("search-results",{searchCriteria: req.params.criteria});
 /* Listing.findById(req.params.id, function(err, listing) {
    if (err) { console.log(err); res.redirect("/"); }
    else { res.render("editlisting", {listing: listing}) }
  });*/
}

module.exports = listingsController;
