'use strict';

var express = require('express');
var bodyParser = require('body-parser');

var MongoClient = require('mongodb').MongoClient;

var PORT = 1337;
var db_URL = 'mongodb://localhost:27017';

var server = express();

const path = require('path');

// parse application/x-www-form-urlencoded
server.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
server.use(bodyParser.json())

server.use(express.static(path.join(__dirname, '/public')));

server.set('view engine', 'pug');
server.set('views', './views')

//Database Connect


//console.log(list_User);

server.get('/', (req, res) => {
    res.render('login_Page');
})

server.get('/users', (req, res) => {
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

server.listen(PORT, () => console.log('Server is listening on ' + PORT));