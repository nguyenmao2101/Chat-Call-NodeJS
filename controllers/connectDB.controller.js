var Users = require('../models/users.model');
var securePassword = require('./secure.controller');
var ObjectID = require('mongodb').ObjectID;

module.exports.getUsers = async (req, res) => {
    var loggedUser = await Users.findOne({ _id: req.signedCookies.userId });
    var list_users = await Users.find({ _id: { $ne: req.signedCookies.userId } });
    res.render('users_Page', { loggeduser: loggedUser, users: list_users })
}

module.exports.getUserInfo = async (req, res) => {
    var user = await Users.findOne({ _id: req.params.id });
    //fill code
}

//Add User to database
module.exports.addUser = async (req, res) => {
    var allow = await Users.find({ email: req.body.email });
    if (allow.length != 0) {
        error = "Account already exists. Please Login!";
        res.render('signup_Page', { err: error });
        return;
    }
    var infoNewUser = new Users({
        _id: new ObjectID(), 
        name: req.body.name, 
        email: req.body.email,
        password: securePassword.encryptPassword(req.body.password), 
        avatar: ""
    });

    infoNewUser.save((err, res) => {
        if (err) throw err;
        console.log('Insert user success!');
    })
    res.redirect('/login');
}

//Get infomation to show on main community screen
module.exports.getCommunityInfo = async (req, res) => {
    try {
        var userInfo = await Users.findOne({_id: req.params.id});
        console.log('info: '+userInfo);
        res.send(userInfo);
    } catch (err) {
        console.log(err);
    }
    
}
