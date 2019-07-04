const express = require('express');
const connect = require('../controllers/connectDB.controller');

var router = express.Router();

router.get('/', connect.verifiedAccount);

module.exports = router;