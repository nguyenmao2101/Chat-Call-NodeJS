const express = require('express');
var router = express.Router();

var direct = require('../controllers/users.controller');
var auth = require('../controllers/auth.controller');
var LoggedInBack = require("../middlewares/auth.middle").LoggedIn;

router.get('/', LoggedInBack, direct.login);
router.post('/', LoggedInBack, auth.identityUser);

module.exports = router;