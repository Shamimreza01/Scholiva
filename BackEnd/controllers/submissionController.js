const Submission = require('../models/Submission');
const Quiz = require('../models/Quiz');

exports.submitQuiz = async (req, res) => {
  try {
    const { quizId, answers, timeTaken } = req.body;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    let score = 0;
    const evaluatedAnswers = answers.map(ans => {
      const question = quiz.questions[ans.questionIndex];
      
      if (question.type === 'mcq') {
        const isCorrect = question.answer === ans.selectedOption;
        if (isCorrect) score += 1;
        else if (ans.selectedOption) score -= quiz.negativeMarking;
        return { ...ans, isCorrect };
      } else {
        // Short answer questions are marked as 'complete' (isCorrect true for now as a placeholder for effort)
        // or we just store them. For scoring purposes, they contribute 0 until graded.
        return { ...ans, isCorrect: !!ans.shortAnswer };
      }
    });

    const submission = new Submission({
      student: req.user.id,
      quiz: quizId,
      answers: evaluatedAnswers,
      score,
      timeTaken
    });

    await submission.save();

    // Add result to Quiz model for participation tracking
    quiz.results.push({
      studentId: req.user.id,
      score: score,
      submittedAt: new Date()
    });
    await quiz.save();

    res.json(submission);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ student: req.user.id }).populate('quiz', 'title');
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id).populate('quiz');
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    
    // Security check: only the student who submitted or a teacher can view
    if (req.user.role === 'student' && submission.student.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(submission);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Teacher View: Serial student list marked-wise
exports.getQuizSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ quiz: req.params.quizId })
      .populate('student', 'name email')
      .sort({ score: -1 }); // Serial student list marked-wise (high to low)
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getMySubmissionByQuiz = async (req, res) => {
  try {
    const submission = await Submission.findOne({ 
      student: req.user.id, 
      quiz: req.params.quizId 
    }).populate('quiz');
    
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    res.json(submission);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
