import express from 'express';
import * as submissionController from '../controllers/submissionController.js';
import { auth, checkRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/submit', auth, checkRole(['student']), submissionController.submitQuiz);
router.get('/my', auth, checkRole(['student']), submissionController.getMySubmissions);
router.get('/my-quiz/:quizId', auth, checkRole(['student']), submissionController.getMySubmissionByQuiz);
router.get('/details/:id', auth, submissionController.getSubmissionById);
router.get('/quiz/:quizId', auth, checkRole(['teacher']), submissionController.getQuizSubmissions);

export default router;
