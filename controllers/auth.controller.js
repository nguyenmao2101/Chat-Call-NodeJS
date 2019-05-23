const securePassword = require('./secure.controller');

var Users = require('../models/users.model');


var checkUserExists = async (userEmail) => {
    var existsUser = await Users.find({ email: userEmail });

    console.log(existsUser);
    if (existsUser.length == 0) {
        return false;
    }
    return existsUser[0].password;
}


module.exports.identityUser = async (req, res) => {
    var exists = await checkUserExists(req.body.email);
    console.log(exists);
    console.log(typeof(exists));
    if (!exists) {
        res.render('login_Page', { err: "Account does not exists!!!" });
        return; 
    }

    var correctPass = securePassword.decryptPassword(req.body.password, exists);

    if (!correctPass) {
        res.render('login_Page', { err: "Password incorrect!!!" });
        return; 
    }
    res.redirect('/users');
}

