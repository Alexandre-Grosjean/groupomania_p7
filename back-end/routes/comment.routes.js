const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware')
const commentCtrl = require('../controllers/comment.controller');

router.post('/posts/:uuid', commentCtrl.createComment);
router.delete('/:id' , commentCtrl.deleteComment);


module.exports = router;