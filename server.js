'use strict';
var express = require('express');
var bodyParser = require('body-parser');

var userRoutes = require('./routes/user.routes');

var PORT = 1337;

var server = express();

const path = require('path');

// parse application/x-www-form-urlencoded
server.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
server.use(bodyParser.json())
server.use(express.static(path.join(__dirname, '/public')));

server.set('view engine', 'pug');
server.set('views', './views')

server.get('/', (req, res) => {
    res.render('login_Page');
})

server.use('/users', userRoutes);

server.listen(PORT, () => console.log('Server is listening on ' + PORT));