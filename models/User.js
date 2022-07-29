const mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    uid : String,
    token : String,
    email : String,
    name : String,
    gender : String,
    pic : String,
    balance : {type : Number, default : 0},
    admin : {type : Boolean, default : false},
    posts : {type : Array, default : []},
});

module.exports = mongoose.model('User', userSchema);

// So to store in MongoDB