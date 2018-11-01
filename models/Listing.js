var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var passportLocalMongoose = require('passport-local-mongoose');

var ListingSchema = new mongoose.Schema({
    shortdesc: String,
    longdesc: String,
    tags:     String,
    price: Number,
    address: String
});

//ListingSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Listing', ListingSchema);
