const express = require('express');

var connect = require('../controllers/connectDB.controller');
var direct = require('../controllers/users.controller')

var router = express.Router();

router.get('/', direct.signup)
router.post('/', connect.addUser)

module.exports = router;