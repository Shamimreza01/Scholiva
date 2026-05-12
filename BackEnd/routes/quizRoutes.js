const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { auth, checkRole } = require('../middleware/auth');

router.post('/', auth, checkRole(['teacher']), quizController.createQuiz);
router.get('/', auth, quizController.getQuizzes);
router.get('/teacher', auth, checkRole(['teacher']), quizController.getTeacherQuizzes);
router.get('/:id', auth, quizController.getQuizById);
router.put('/:id', auth, checkRole(['teacher']), quizController.updateQuiz);

module.exports = router;
