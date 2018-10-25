var mongoose = require('mongoose');

const Schema = mongoose.Schema;

let Listing = new Schema({
    title: {
        type: String
    },
    price: {
        type: String
    },
    description: {
        type: String
    },
    category: {
        type: String
    }
});

module.exports = mongoose.model('Listing', Listing);