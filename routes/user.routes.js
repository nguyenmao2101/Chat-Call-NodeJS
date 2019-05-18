var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var router = express.Router();


var db_URL = 'mongodb://localhost:27017';

router.get('/', (req, res) => {
    MongoClient.connect(db_URL, function (err, client) {
        if (err) { return console.dir(err); }
        var db = client.db('NODEJS_APP');
        db.collection("Users").find({}).toArray(function (err, list_Users) {
            if (err) throw err;
            res.render('users_Page', { users: list_Users });
            client.close();
        });
    });
})

module.exports = router;
