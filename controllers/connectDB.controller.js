const bcrypt = require('bcrypt');

var Users = require('../models/users.model');
var ObjectID = require('mongodb').ObjectID;

module.exports.getUsers = async (req, res) => {
    var list_users = await Users.find();
    res.render('users_Page', { users: list_users })
}


module.exports.addUser = async (req, res) => {
    var allow = await Users.find({ email: req.body.email });
    if (allow.length != 0) {
        error = "Account already exists. Please Login!";
        res.render('signup_Page', { err: error });
        return;
    }
    var infoNewUser = new Users({ _id: new ObjectID(), 
                                    name: req.body.name, 
                                    email: req.body.email, 
                                    password: bcrypt.hashSync(req.body.password, 10), 
                                    avatar: "" });

    infoNewUser.save((err, res) => {
        if (err) throw err;
        console.log('Insert user success!');
    })
    res.redirect('/login');
}