import express from 'express';
import * as quizController from '../controllers/quizController.js';
import { auth, checkRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, checkRole(['teacher']), quizController.createQuiz);
router.get('/', auth, quizController.getQuizzes);
router.get('/teacher', auth, checkRole(['teacher']), quizController.getTeacherQuizzes);
router.get('/:id', auth, quizController.getQuizById);
router.put('/:id', auth, checkRole(['teacher']), quizController.updateQuiz);

export default router;
