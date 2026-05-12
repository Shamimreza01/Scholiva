import express from 'express';
import * as postController from '../controllers/postController.js';
import { auth, checkRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, postController.getPosts);
router.post('/', auth, checkRole(['teacher']), postController.createPost);
router.put('/:id/interact', auth, postController.interactWithPost);
router.put('/:id/share', auth, postController.sharePost);
router.post('/:id/comment', auth, postController.addComment);
router.delete('/:id/comment/:commentId', auth, postController.deleteComment);
router.delete('/:id', auth, checkRole(['teacher']), postController.deletePost);

export default router;
