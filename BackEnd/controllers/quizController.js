import Quiz from '../models/Quiz.js';
import Classroom from '../models/Classroom.js';
import User from '../models/User.js';

export const createQuiz = async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can create quizzes' });
    }
    const { title, duration, negativeMarking, questions, visibility, classroomId } = req.body;
    const quiz = new Quiz({
      title,
      duration,
      negativeMarking,
      questions,
      visibility: visibility || 'public',
      classroomId: visibility === 'private' ? classroomId : null,
      teacher: req.user.id
    });
    await quiz.save();
    res.status(201).json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getQuizzes = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // 1. Find classrooms the student is in
    const myClassrooms = await Classroom.find({ students: req.user.id }).select('_id');
    const classroomIds = myClassrooms.map(c => c._id);

    // 2. Query Quizzes based on 3-layer visibility
    const quizzes = await Quiz.find({
      $or: [
        { visibility: 'public' },
        { 
          visibility: 'protected', 
          teacher: { $in: user.connections } 
        },
        { 
          visibility: 'private', 
          classroomId: { $in: classroomIds } 
        }
      ]
    }).populate('teacher', 'name').sort({ createdAt: -1 });

    const quizzesWithStatus = quizzes.map(quiz => {
      const quizObj = quiz.toObject();
      quizObj.hasSubmitted = quiz.results.some(r => r.studentId.toString() === req.user.id);
      quizObj.hasAttempted = quiz.participants.some(id => id.toString() === req.user.id);
      return quizObj;
    });

    res.json(quizzesWithStatus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTeacherQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ teacher: req.user.id }).sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateQuiz = async (req, res) => {
  try {
    const { title, duration, negativeMarking, questions, visibility, classroomId } = req.body;
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz || quiz.teacher.toString() !== req.user.id || req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Unauthorized: Only the assigned teacher can edit this quiz' });
    }

    quiz.title = title || quiz.title;
    quiz.duration = duration || quiz.duration;
    quiz.negativeMarking = negativeMarking || quiz.negativeMarking;
    quiz.questions = questions || quiz.questions;
    quiz.visibility = visibility || quiz.visibility;
    quiz.classroomId = visibility === 'private' ? classroomId : null;

    await quiz.save();
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    // Security: If student and not submitted, strip the correct answers
    if (req.user.role === 'student') {
      const hasSubmitted = quiz.results.some(r => r.studentId.toString() === req.user.id);
      
      if (!hasSubmitted) {
        // Create a safe version of the questions without correct answers
        const safeQuestions = quiz.questions.map(q => {
          const { correctAnswer, ...rest } = q.toObject();
          return rest;
        });

        // Track that they viewed the questions (Entry tracking)
        const hasEntered = quiz.participants.some(id => id.toString() === req.user.id);
        if (!hasEntered) {
          quiz.participants.push(req.user.id);
          await quiz.save();
        }

        return res.json({ 
          ...quiz.toObject(), 
          questions: safeQuestions, 
          alreadySubmitted: false 
        });
      } else {
        return res.json({ ...quiz.toObject(), alreadySubmitted: true });
      }
    }

    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
