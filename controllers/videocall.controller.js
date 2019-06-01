// module.exports.call = (req, res) => {
//     var peerId = req.query.peerId;
//     console.log(peerId);
//     res.render('videocall/videocall_Page', { idCallee: peerId });
// }

module.exports.call = (req, res) => {
    res.render('videocall/videocall_Page');
}