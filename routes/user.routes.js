var express = require('express');

var connect = require('../controllers/connectDB.controller');

var router = express.Router();

router.get('/', connect.getUsers)

module.exports = router;
