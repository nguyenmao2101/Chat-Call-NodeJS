module.exports = {
    login: (req, res) => {
        res.render('loginPage');
    },

    signup: (req, res) => {
        res.render('signupPage');
    },
    logout: (req, res) => {
        delete req.session.user;
        res.redirect('/login');
    }
}