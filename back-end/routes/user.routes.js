const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const authCtrl = require('../controllers/auth.controller');
const userCtrl = require('../controllers/user.controller');
const upload = require('../middleware/multer-config');

// registration
router.post('/register', authCtrl.register);
// login
router.post('/login', authCtrl.login);
// change profil
router.post('/profil/', auth, userCtrl.profil);
// update profil
router.put('/updateProfil/users/:uuid', auth,  upload.single('imageProfil'), userCtrl.updateProfil);
//desactivation account
router.put('/desactivate/users/:uuid', auth,  userCtrl.desactivate);


module.exports = router;