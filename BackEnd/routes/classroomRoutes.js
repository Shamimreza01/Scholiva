const express = require('express');
const router = express.Router();
const classroomController = require('../controllers/classroomController');
const { auth, checkRole } = require('../middleware/auth');

router.post('/', auth, checkRole(['teacher']), classroomController.createClassroom);
router.get('/', auth, checkRole(['teacher']), classroomController.getClassrooms);
router.get('/available', auth, checkRole(['student']), classroomController.getAvailableClassrooms);
router.get('/:id', auth, classroomController.getClassroomById);
router.get('/:id/rankings', auth, classroomController.getClassroomRankings);
router.post('/:id/join', auth, checkRole(['student']), classroomController.requestToJoin);
router.post('/:id/requests', auth, checkRole(['teacher']), classroomController.handleJoinRequest);

module.exports = router;
