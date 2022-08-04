const mongoose = require('mongoose');

var postSchema = mongoose.Schema({
    href : String,
    description : String,
    reward : Number,
    goal : Number,
    opName : String,
    opPic : String,
    createdAt : Date,
    opUid : String,
    available : Number,
    hidden : {type : Boolean, default : false},
});

module.exports = mongoose.model('Post', postSchema);

// So to store in MongoDB