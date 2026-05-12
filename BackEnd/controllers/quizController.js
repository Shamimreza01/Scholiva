import Quiz from '../models/Quiz.js';
import Classroom from '../models/Classroom.js';
import User from '../models/User.js';

export const createQuiz = async (req, res) => {
  try {
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
    }).populate('teacher', 'name');

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
    const quizzes = await Quiz.find({ teacher: req.user.id });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateQuiz = async (req, res) => {
  try {
    const { title, duration, negativeMarking, questions, visibility, classroomId } = req.body;
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz || quiz.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
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

    // Student Access Logic
    if (req.user.role === 'student') {
      const hasSubmitted = quiz.results.some(r => r.studentId.toString() === req.user.id);
      
      if (hasSubmitted) {
        return res.json({ ...quiz.toObject(), alreadySubmitted: true });
      }

      // Track that they viewed the questions (Entry tracking)
      const hasEntered = quiz.participants.some(id => id.toString() === req.user.id);
      if (!hasEntered) {
        quiz.participants.push(req.user.id);
        await quiz.save();
      }
    }

    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
