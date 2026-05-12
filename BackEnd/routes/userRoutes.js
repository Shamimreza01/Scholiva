const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, checkRole } = require('../middleware/auth');

router.get('/teachers', auth, userController.getTeachers);
router.get('/profile', auth, userController.getProfile);
router.get('/learning-stats', auth, checkRole(['student']), userController.getStudentLearningStats);
router.put('/update-profile', auth, userController.uploadMiddleware, userController.updateProfile);
router.get('/:id', auth, userController.getUserById);
router.post('/connect/:id', auth, checkRole(['student']), userController.requestConnection);
router.post('/requests', auth, checkRole(['teacher']), userController.handleConnectionRequest);

module.exports = router;
