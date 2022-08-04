const mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    uid : String,
    token : String,
    name : String,
    pic : String,
    nonce : String,
    balance : {type : Number, default : 0},
    admin : {type : Boolean, default : false},
    posts : {type : Array, default : []},
    inactivePosts : {type : Array, default : []},
    likedPost : {type : Array, defalt : []},
});

module.exports = mongoose.model('User', userSchema);

// So to store in MongoDB