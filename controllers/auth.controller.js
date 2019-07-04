var securePassword = require('./secure.controller');
var Users = require('../models/users.model');

var checkUserExists = async (userEmail) => {
    var existsUser = await Users.findOne({ email: userEmail });
    if (!existsUser) {
        return false;
    }
    return existsUser;
}


module.exports.identityUser = async (req, res) => {
    var existsUser = await checkUserExists(req.body.email);
    if (!existsUser) {
        res.render('login_Page', { err: "Tài khoản không tồn tại!!!" });
        return; 
    }

    if (!existsUser.isValidated) {
        res.render('login_Page', { err: "Tài khoản chưa được kích hoạt!!!" });
        return; 
    }
    var correctPass = securePassword.decryptPassword(req.body.password, existsUser.password);

    if (!correctPass) {
        res.render('login_Page', { err: "Sai mật khẩu!!!" });
        return; 
    }
    req.session.user = existsUser;
    delete req.session.user.password;
    res.redirect('/chat');
}

