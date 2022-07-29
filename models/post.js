const mongoose = require('mongoose');

var postSchema = mongoose.Schema({
    href : String,
    href_encoded : String,
    description : String,
    reward : Number,
    goal : Number,
    opName : String,
    opPic : String,
    createdAt : Date,
});

module.exports = mongoose.model('Post', postSchema);

// So to store in MongoDB