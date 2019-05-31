var Users = require('../models/users.model');

module.exports.requireAuth = (req, res, next) => {
    if (!req.signedCookies.userId) {
        res.redirect('/login');
        return;
    }

    var existUser = Users.findOne({ _id: req.signedCookies.userId });
    if (!existUser) {
        res.redirect('/login');
        return;
    }
    res.locals.loggedId = req.signedCookies.userId;
    next();
}