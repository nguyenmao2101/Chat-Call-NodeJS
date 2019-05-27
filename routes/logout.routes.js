const express = require('express');
var router = express.Router();
var direct = require('../controllers/users.controller').logout;

router.get('/', direct);

module.exports = router;