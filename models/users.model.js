const mongoose = require('mongoose');

mongoose.set('debug', true);
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });

var usersSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    avatar: String,
    createdOn : {type:Date,default:Date.now},
    lastActive : {type:Date,default:Date.now}
});

var Users = mongoose.model('Users', usersSchema, 'Users');

module.exports = Users;