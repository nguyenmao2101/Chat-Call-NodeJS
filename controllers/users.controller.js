
module.exports = {
    login: (req, res) => {
        res.render('login_Page');
    },

    signup: (req, res) => {
        res.render('signup_Page');
    },
    logout: (req, res) => {
        delete req.session.user;
        res.redirect('/login');
    },
}

