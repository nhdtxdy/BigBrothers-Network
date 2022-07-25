const mongoose = require('mongoose');

var postSchema = mongoose.Schema({
    href : String,
    description : String,
    reward : Number,
    op_uid : String,
});

module.exports = mongoose.model('Post', postSchema);