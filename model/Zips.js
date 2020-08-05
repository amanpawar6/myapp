const mongoose = require('mongoose');

const zipsSchema = new mongoose.Schema({
    "city" : String,
    "loc" : Array,
    "pop" : Number,
	"state" : String
})

zips = mongoose.model('zips', zipsSchema);

module.exports = zips;