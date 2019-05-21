const mongoose = require('mongoose');

mongoose.set('debug', true);

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });

var usersSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    avatar: String
});

var Users = mongoose.model('Users', usersSchema, 'Users');

module.exports = Users;