'use strict'
require('dotenv').config()

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var methodOverride = require('method-override');
var path = require('path');
var fs = require('fs');
var logger = require('morgan');

var app = express();
var http = require('http').createServer(app);

var HOST = process.env.HOST || "127.0.0.1";
var PORT = process.env.PORT || 1337;


var userRoutes = require('./routes/user.routes');
var signupRoutes = require('./routes/signup.routes');
var loginRoutes = require('./routes/login.routes');
var logoutRoutes = require('./routes/logout.routes');
var authMiddlewares = require('./middlewares/auth.middle');

//socket.io
require('./public/js/chat.js').sockets(http);

//connect to mongodb database
mongoose.connect(process.env.MONGODB, {useNewUrlParser: true});
mongoose.connection.once('open', () => {
    console.log("Database Connection Established Successfully.");
});

//http method override middleware
app.use(methodOverride((req,res) => {
    if(req.body && typeof req.body === 'object' && '_method' in req.body){
        var method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

//including models files.
fs.readdirSync("./models").forEach(function(file){
    if(file.indexOf(".js")){
      require("./models/"+file);
    }
  });

//session setup
var sessionInit = session({
    name : 'userCookie',
    secret : '9743-980-270-india',
    resave : true,
    httpOnly : true,
    saveUninitialized: true,
    store : new mongoStore({mongooseConnection : mongoose.connection}),
    cookie : { maxAge : 100*100*800 }
});
app.use(sessionInit);

//parsing middlewares
app.use(bodyParser.json({limit:'50mb',extended:true}));
app.use(bodyParser.urlencoded({limit:'50mb',extended:true}));
app.use(cookieParser());

//public folder as static
app.use(express.static(path.join(__dirname, '/public')));

//views folder and setting ejs engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.use('/login', loginRoutes);
app.use('/signup', signupRoutes);
app.use('/dashboard', userRoutes);
app.use('/logout', logoutRoutes);
app.get('/', (req, res) => {
    res.redirect('/login');
});
app.use(authMiddlewares.requireAuth);

http.listen(PORT, HOST, () => {
    console.log('Server is running at http://' + HOST + ':' + PORT);
});