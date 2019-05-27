var Users = require('../models/users.model');
var securePassword = require('./secure.controller');
var ObjectID = require('mongodb').ObjectID;

module.exports.getUsers = (req, res) => {
    res.render('chat', {
        title: "Message",
        user: req.session.user,
    });
}

module.exports.checkEmail = (req, res, next) => {
    Users.findOne({ 'email': req.body.email }, (err, result) => {
        if (err) {
            console.log("Some problem occurs!!");
        } else if (result) {
            console.log("Account already exists. Please Login!");
            res.redirect("/login");
        }
        else {
            next();
        }
    });
}

module.exports.addUser = (req, res) => {

    var infoNewUser = new Users({

        _id: new ObjectID(), 
        name: req.body.name, 
        email: req.body.email,
        password: securePassword.encryptPassword(req.body.password), 
        avatar: "../public/assets/images/device-camera-video.svg",
        created: Date.now(),
        updated: Date.now()

    });

    infoNewUser.save((err, result) => {
        if (err) {
            console.log('Some problems occur');
        } else if(result == undefined || result == null || result == ""){
            console.log('Can not create account. Try again!');
        }
        else{
            req.user = result;
            delete req.user.password;
            req.session.user = result;
            delete req.session.user.password;
            res.redirect('/dashboard');
          }
    });
}