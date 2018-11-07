var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require("../models/User");

var ListingSchema = new mongoose.Schema({
    shortdesc:  {type: String, required: true},
    longdesc:   {type: String, required: true},
    tags:       {type: [String], required: true},
    price:      {type: Number, required: true},
    address:    {type: String, required: true},
    file:       {type: String},
    user:       {type: Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Listing', ListingSchema);
