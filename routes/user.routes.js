const express = require('express');

var connect = require('../controllers/connectDB.controller');

var router = express.Router();

router.get('/', connect.getUsers);

router.get('/:id', connect.getCommunityInfo);

module.exports = router;
