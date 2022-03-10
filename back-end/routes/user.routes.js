const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');
const upload = require('../middleware/multer-config');

// registration
router.post('/register', authCtrl.register);
// login
router.post('/login', authCtrl.login);

//test
// router.post('/test',upload.single('imagePost'),upload.single('imageProfil'), authCtrl.test);

module.exports = router;