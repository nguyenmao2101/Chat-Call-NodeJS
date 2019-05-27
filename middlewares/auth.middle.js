var mongoose = require('mongoose');
var Users = mongoose.model('Users');

module.exports.requireAuth = (req, res, next) => {

    if(req.session && req.session.user){

	Users.findOne({'email': req.session.user.email}, function(err, user){

	        if(user){
                        req.user = user;
                        delete req.user.password;
                        req.session.user = user;
                        delete req.session.user.password;
                        next();
		}

        });
        
	}
	else{
                res.redirect('/login');
                next();
	}
}

module.exports.checkLogin = (req, res, next) => {

        if (!req.user && !req.session.user) {
                res.redirect('/login');
        }
        else {
                next();
        }
}

module.exports.LoggedIn = (req, res, next) => {

        if(!req.user && !req.session.user){
		next();
	}
	else{
		res.redirect('/dashboard');
	}

}