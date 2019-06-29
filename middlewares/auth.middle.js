var Users = require('../models/users.model');

module.exports.requireAuth = (req, res, next) => {
    if (!req.session.user) {
        res.redirect('/login');
        return;
    }

    var existUser = Users.findOne({ _id: req.session.user._id});
    if (!existUser) {
        res.redirect('/login');
        return;
    }
    next();
}