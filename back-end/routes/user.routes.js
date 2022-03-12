const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');
const userCtrl = require('../controllers/user.controller');
const upload = require('../middleware/multer-config');

// registration
router.post('/register', authCtrl.register);
// login
router.post('/login', authCtrl.login);
//get profil
router.get('/myprofil/users/:uuid', userCtrl.myprofil);
// change profil
router.post('/profil/', userCtrl.profil);
// update profil
router.put('/updateProfil/users/:uuid', upload.single('imageProfil'), userCtrl.updateProfil);
//desactivation account
router.put('/desactivate/users/:uuid', userCtrl.desactivate);


module.exports = router;