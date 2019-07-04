const mongoose = require('mongoose');

var usersSchema = new mongoose.Schema({
    name: {type:String, default: "", required: true},
    email: {type:String, default: "", required: true},
    password: {type:String, default: "", required: true},
    avatar: {type:String, default: ""},
    isValidated: {type:Boolean, default: false, required: true},
    createdOn : {type:Date,default:Date.now},
    lastActive : {type:Date,default:Date.now},
    hashCode: {type: String, default: ""}
});

var Users = mongoose.model('Users', usersSchema, 'Users');

module.exports = Users;