var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ListingSchema = new mongoose.Schema({
    shortdesc: String,
    longdesc: String,
    tags:     [String],
    price: Number,
    address: String
});

module.exports = mongoose.model('Listing', ListingSchema);
