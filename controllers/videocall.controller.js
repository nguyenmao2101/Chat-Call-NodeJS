module.exports.call = (req, res) => {
    var peerId = req.query.peerId;
    console.log(peerId);
    res.render('videocall/videocall_Page', { idCallee: peerId });
}
