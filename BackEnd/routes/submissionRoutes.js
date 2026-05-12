const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const { auth, checkRole } = require('../middleware/auth');

router.post('/submit', auth, checkRole(['student']), submissionController.submitQuiz);
router.get('/my', auth, checkRole(['student']), submissionController.getMySubmissions);
router.get('/my-quiz/:quizId', auth, checkRole(['student']), submissionController.getMySubmissionByQuiz);
router.get('/details/:id', auth, submissionController.getSubmissionById);
router.get('/quiz/:quizId', auth, checkRole(['teacher']), submissionController.getQuizSubmissions);

module.exports = router;
