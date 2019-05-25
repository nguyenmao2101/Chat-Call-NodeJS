'use strict';

require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const path = require('path');

var userRoutes = require('./routes/user.routes');
var signupRoutes = require('./routes/signup.routes');
var loginRoutes = require('./routes/login.routes,');
var authMiddlewares = require('./middlewares/auth.middle');

var PORT = 1337;
var server = express();



// parse application/x-www-form-urlencoded
server.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
server.use(bodyParser.json());
server.use(cookieParser(process.env.SECRET));
server.use(express.static(path.join(__dirname, '/public')));

server.set('view engine', 'pug');
server.set('views', './views')

server.get('/', authMiddlewares.requireAuth, userRoutes);

server.use('/dashboard', authMiddlewares.requireAuth, userRoutes);
server.use('/signup', signupRoutes);
server.use('/login', loginRoutes);

server.listen(PORT, () => console.log('Server is listening on ' + PORT));