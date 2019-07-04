'use strict';

require('dotenv').config()

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);

var signupRoutes = require('./routes/signup.routes');
var loginRoutes = require('./routes/login.routes,');
var logout = require('./routes/logout.route');
var authMiddlewares = require('./middlewares/auth.middle');
var videoCall = require('./routes/videocall.routes');
var chat = require('./routes/chat.route');
var userRoutes = require('./routes/user.routes');
var verifyAcc = require('./routes/verifyacc.routes');

var app = express();
var server = require('http').createServer(app);
require('./controllers/serverSocket.controller.js').sockets(server);

//connect to mongodb database
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true});
mongoose.connection.once('open', () => {
    console.log("Database Connection Established Successfully!");
});

//Session init
var sessionInit = session({
    name : 'userCookie',
    secret : process.env.SECRET,
    resave : true,
    httpOnly : true,
    saveUninitialized: true,
    store : new mongoStore({mongooseConnection : mongoose.connection}),
    cookie : { maxAge : 900000 }
});

app.use(sessionInit);

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
app.get('/', authMiddlewares.requireAuth, loginRoutes);

app.use('/videocall', authMiddlewares.requireAuth, videoCall);
app.use('/chat', authMiddlewares.requireAuth, chat);
app.use('/user', authMiddlewares.requireAuth, userRoutes);

app.use('/verify', verifyAcc)
app.use('/signup', signupRoutes);
app.use('/login', loginRoutes);
app.use('/logout', logout);
/*END MAIN ROUTES*/

server.listen(process.env.PORT, () => console.log('Server is listening on ' + process.env.PORT));