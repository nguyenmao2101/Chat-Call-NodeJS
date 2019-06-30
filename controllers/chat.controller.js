module.exports.GetChat = (req, res) => {
    res.render("chat", {user: req.session.user});
}