const express = require('express');

var user = require('../controllers/users.controller');

var router = express.Router();

router.get('/', user.logout);

module.exports = router;