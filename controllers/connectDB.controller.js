var Users = require('../models/users.model');
var securePassword = require('./secure.controller');
var ObjectID = require('mongodb').ObjectID;

const nodemailer = require('nodemailer');
const crypto = require("crypto");

module.exports.addUser = async (req, res) => {
    var allow = await Users.find({ email: req.body.email });
    if (allow.length != 0) {
        error = "Tài khoản đã tồn tại!";
        res.render('signup_Page', { err: error });
        return;
    }

    const hashCode = crypto.randomBytes(30).toString('hex');
    var infoNewUser = new Users({
        _id: new ObjectID(), 
        name: req.body.name, 
        email: req.body.email,
        password: securePassword.encryptPassword(req.body.password), 
        avatar: "",
        createdOn: Date.now(),
        lastActive: Date.now(),
        hashCode: hashCode
    });

    infoNewUser.save((err, res) => {
        if (err) throw err;
        console.log('Insert user success!');
    })

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'sangtran251298@gmail.com',
          pass: 'sang25_admin' 
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: 'sangtran251298@gmail.com',
        to: req.body.email, 
        subject: "[VERIFY ACCOUNT]", 
        html: "<span>Click <a href='http://localhost:1337/verify?userId="+infoNewUser._id+"&token="+hashCode+"'>here</a> to active account!!!</span>" 
    });
    console.log("Message sent: %s", info.messageId);
    res.redirect('/login');
}

module.exports.getNameUserByID = async (req, res) => {
    try {
        var info = await Users.findOne()
        .select('name')
        .where('_id').equals(req.params.id);
        res.send(info.name);
    } catch (e){
        console.log(e);
    }
}

module.exports.verifiedAccount = async (req, res) => {
    var userId = req.query.userId;
    var hashCode = req.query.token;
    if (!userId || !hashCode) {
        console.log('UserId or hashCode is not correct!');
        return;
    }

    const filter = { _id: userId };
    // const update = {'$inc':{ isValidated: true }};
    var verified = await Users.updateOne({_id: userId}, {$set: { isValidated: true }}, {upsert: false}, function(err){
        if (err) {
            console.log('Could not update!' + err);
            return;
        } else {
            console.log('Updated Success');
        }
    })
    res.render('login_Page', { success: 'Kích hoạt tài khoản thành công!' });
}

module.exports.updateInfo = async (req, res) => {
    var userId = req.query.userId;
    var avatarPath = req.file.path.split("\\").slice(1).join("/");
    const filter = { _id: userId };
    var verified = await Users.updateOne({_id: userId}, {$set: { avatar: avatarPath }}, {upsert: false}, function(err){
        if (err) {
            res.send(err);
            console.log('Could not update!' + err);
            return;
        }
    })
    
    console.log('Updated Success');
    res.send(avatarPath);
}
