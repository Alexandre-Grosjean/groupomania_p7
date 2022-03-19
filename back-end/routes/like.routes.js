const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware')
const likeCtrl = require('../controllers/like.controller');

router.post('/posts/:uuid' , auth, likeCtrl.createLike);

module.exports = router;