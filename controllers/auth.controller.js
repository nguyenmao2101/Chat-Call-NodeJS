require('dotenv').config()
var securePassword = require('./secure.controller');
var mongoose = require('mongoose');
var Users = mongoose.model("Users");

module.exports.identityUser = (req, res) => {

    var encryptPass = securePassword.encryptPassword(req.body.password);

    Users.findOne({$and:[{'email': req.body.email }, {'password': encryptPass}]}, (err, result) => {

        if (err) {
            console.log("Some problems occur!!");
            res.redirect('/login');
        }
        else if (result == null || result == undefined || result == "") {
            console.log("Your account does not exists");
            res.redirect('/login');
        }
        else {
            req.user = result;
            delete req.user.password;
            req.session.user = result;
            delete req.session.user.password;
            res.redirect('/dashboard');
        }

    });
}