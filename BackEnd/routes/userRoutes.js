import express from 'express';
import * as userController from '../controllers/userController.js';
import { auth, checkRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/teachers', auth, userController.getTeachers);
router.get('/search', auth, userController.searchUsers);
router.get('/profile', auth, userController.getProfile);
router.get('/learning-stats', auth, checkRole(['student']), userController.getStudentLearningStats);
router.put('/update-profile', auth, userController.uploadMiddleware, userController.updateProfile);
router.get('/:id', auth, userController.getUserById);
router.post('/connect/:id', auth, checkRole(['student']), userController.requestConnection);
router.post('/requests', auth, checkRole(['teacher']), userController.handleConnectionRequest);

export default router;
