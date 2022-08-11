const mongoose = require('mongoose');

var postSchema = mongoose.Schema({
    opUid : String,
    href : String,
    description : String,
    reward : Number,
    goal : Number,
    available : Number,
    createdAt : Date,
});

module.exports = mongoose.model('InactivePost', postSchema);

// So to store in MongoDB