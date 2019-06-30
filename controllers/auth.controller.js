var securePassword = require('./secure.controller');
var Users = require('../models/users.model');


var checkUserExists = async (userEmail) => {
    var existsUser = await Users.findOne({ email: userEmail });

    console.log(existsUser);
    if (!existsUser) {
        return false;
    }
    return existsUser;
}


module.exports.identityUser = async (req, res) => {
    var existsUser = await checkUserExists(req.body.email);
    if (!existsUser) {
        res.render('login_Page', { err: "Account does not exists!!!" });
        return; 
    }

    var correctPass = securePassword.decryptPassword(req.body.password,
                                                        existsUser.password);

    if (!correctPass) {
        res.render('login_Page', { err: "Password incorrect!!!" });
        return; 
    }
    res.cookie('userId', existsUser._id, { signed: true });
    res.redirect('/');
}

