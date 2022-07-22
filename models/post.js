const mongoose = require('mongoose');

var postSchema = mongoose.Schema({
    href : String,
    description : String,
    reward : Number,
});

module.exports = mongoose.model('Post', postSchema);