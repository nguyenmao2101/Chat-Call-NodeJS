var express = require('express');

//var auth = require('../controllers/auth.controller');
var direct = require('../controllers/users.controller')

var router = express.Router();

router.get('/', direct.login)
//router.post('/', auth.login)

module.exports = router;