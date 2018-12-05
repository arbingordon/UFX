var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new Schema({
    username: String,
    email: String,
    emailurl: String,
    password: String,
    name: String,
    image: {type: String},
    listings: [{ type: Schema.Types.ObjectId, ref: 'Listing' }]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
