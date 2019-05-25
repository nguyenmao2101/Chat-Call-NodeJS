var Users = require('../models/users.model');

module.exports.requireAuth = (req, res, next) => {
    console.log(req.cookies, req.signedCookies);
    if (!req.signedCookies.userId) {
        res.redirect('/login');
        return;
    }

    var existUser = Users.findOne({ _id: req.signedCookies.userId });
    if (!existUser) {
        res.redirect('/login');
        return;
    }
    next();
}