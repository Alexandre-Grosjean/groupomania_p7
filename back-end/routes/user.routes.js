const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');

// registration
router.post('/register', authCtrl.register);
// login
router.post('/login', authCtrl.login);
module.exports = router;