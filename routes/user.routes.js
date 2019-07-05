const express = require('express');
const multer  = require('multer');

var upload = multer({ dest: 'public/images/chat/avatars' });
var connect = require('../controllers/connectDB.controller');

var router = express.Router();

router.get('/:id', connect.getNameUserByID);
router.post('/updateinfo', upload.single('avatar'), connect.updateInfo);

module.exports = router;
