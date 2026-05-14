import express from 'express';
import * as classroomController from '../controllers/classroomController.js';
import { auth, checkRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, checkRole(['teacher']), classroomController.createClassroom);
router.get('/', auth, checkRole(['teacher']), classroomController.getClassrooms);
router.get('/available', auth, checkRole(['student']), classroomController.getAvailableClassrooms);
router.get('/:id', auth, classroomController.getClassroomById);
router.get('/:id/rankings', auth, classroomController.getClassroomRankings);
router.post('/:id/request-join', auth, checkRole(['student']), classroomController.requestToJoin);
router.post('/:id/handle-request', auth, checkRole(['teacher']), classroomController.handleJoinRequest);

export default router;
