const express = require('express');
const router = express.Router();
const likeCtrl = require('../controllers/like.controller');

router.get('/posts/:uuid' , likeCtrl.getLikeOnePost);
router.get('/dislikes/posts/:uuid' , likeCtrl.getDislikeOnePost);
router.post('/posts/:uuid' , likeCtrl.createLike);

module.exports = router;