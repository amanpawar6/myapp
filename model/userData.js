const mongoose = require('mongoose');

const zipsSchema = new mongoose.Schema({
    "name" : String,
    "age" : Number,
    "email" : String,
	"password" : String
})

users = mongoose.model('users', zipsSchema);

module.exports = users;