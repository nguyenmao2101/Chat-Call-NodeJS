'use strict';

require('dotenv').config()

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const path = require('path');
const express = require('express');

var userRoutes = require('./routes/user.routes');
var signupRoutes = require('./routes/signup.routes');
var loginRoutes = require('./routes/login.routes,');
var authMiddlewares = require('./middlewares/auth.middle');
var videoCall = require('./routes/videocall.routes');

var app = express();
var server = require('http').Server(app);
//var io = require('socket.io')(server);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());
app.use(cookieParser(process.env.SECRET));
app.use(express.static(path.join(__dirname, '/public')));

//CONFIG APP
app.set('view engine', 'ejs');
app.set('views', './views')

/*START MAIN ROUTES*/
app.get('/', authMiddlewares.requireAuth, userRoutes);
app.use('/user', authMiddlewares.requireAuth, userRoutes);
app.use('/videocall', authMiddlewares.requireAuth, videoCall)

app.use('/signup', signupRoutes);
app.use('/login', loginRoutes);
/*END MAIN ROUTES*/

server.listen(process.env.PORT, () => console.log('Server is listening on ' + process.env.PORT));