const express = require('express');

var chat = require('../controllers/chat.controller');

var router = express.Router();

router.get('/', chat.GetChat);

module.exports = router;