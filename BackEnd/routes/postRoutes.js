const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { auth, checkRole } = require('../middleware/auth');

router.get('/', auth, postController.getPosts);
router.post('/', auth, checkRole(['teacher']), postController.createPost);
router.put('/:id/interact', auth, postController.interactWithPost);
router.put('/:id/share', auth, postController.sharePost);
router.post('/:id/comment', auth, postController.addComment);
router.delete('/:id/comment/:commentId', auth, postController.deleteComment);
router.delete('/:id', auth, checkRole(['teacher']), postController.deletePost);

module.exports = router;
