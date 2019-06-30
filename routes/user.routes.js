const express = require('express');

var connect = require('../controllers/connectDB.controller');

var router = express.Router();

router.get('/:id', connect.getNameUserByID);

module.exports = router;
