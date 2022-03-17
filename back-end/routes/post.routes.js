const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware')
const postCtrl = require('../controllers/post.controller');
const upload = require('../middleware/multer-config');

router.post('/', upload.single('imagePost'), postCtrl.createPost);
router.get('/',  postCtrl.getAllPosts);
router.delete('/:uuid', postCtrl.deletePost);

module.exports = router;
