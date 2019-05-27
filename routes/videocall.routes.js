const express = require('express');

var videocall = require('../controllers/videocall.controller');

var router = express.Router();

router.get('/incall', videocall.call);

module.exports = router;