const express = require('express');

var connect = require('../controllers/connectDB.controller');
var authLoggedIn = require('../middlewares/auth.middle').checkLogin;
var router = express.Router();

router.get('/', authLoggedIn, connect.getUsers);

module.exports = router;
