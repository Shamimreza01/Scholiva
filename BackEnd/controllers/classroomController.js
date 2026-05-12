import Classroom from '../models/Classroom.js';
import User from '../models/User.js';
import Quiz from '../models/Quiz.js';
import Submission from '../models/Submission.js';

export const createClassroom = async (req, res) => {
  try {
    const { name, description } = req.body;
    const classroom = new Classroom({
      name,
      description,
      teacher: req.user.id
    });
    await classroom.save();
    res.json(classroom);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getClassrooms = async (req, res) => {
  try {
    const classrooms = await Classroom.find({ teacher: req.user.id })
      .populate({ path: 'students', select: 'name email', model: 'User' })
      .populate({ path: 'requests', select: 'name email', model: 'User' });
    res.json(classrooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getClassroomById = async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id)
      .populate('teacher', 'name')
      .populate({ path: 'students', select: 'name email', model: 'User' })
      .populate({ path: 'requests', select: 'name email', model: 'User' });
    
    if (!classroom) return res.status(404).json({ message: 'Classroom not found' });
    
    // Check if user has access
    const isTeacher = classroom.teacher._id.toString() === req.user.id;
    const isStudent = classroom.students.some(s => s._id.toString() === req.user.id);
    
    if (!isTeacher && !isStudent) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(classroom);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getClassroomRankings = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ classroomId: req.params.id });
    const quizIds = quizzes.map(q => q._id);

    const submissions = await Submission.find({ quiz: { $in: quizIds } })
      .populate('student', 'name')
      .sort({ score: -1 });

    // Aggregate unique student stats
    const studentMap = new Map();

    submissions.forEach(r => {
      if (!r.student) return; // Skip if student no longer exists
      const studentId = r.student._id.toString();
      
      if (!studentMap.has(studentId)) {
        studentMap.set(studentId, {
          name: r.student.name,
          totalScore: r.score,
          quizzesTaken: 1,
          avgScore: r.score
        });
      } else {
        const stats = studentMap.get(studentId);
        stats.totalScore += r.score;
        stats.quizzesTaken += 1;
        stats.avgScore = stats.totalScore / stats.quizzesTaken;
      }
    });

    res.json(Array.from(studentMap.values()).sort((a, b) => b.totalScore - a.totalScore));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const requestToJoin = async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id);
    if (!classroom) return res.status(404).json({ message: 'Classroom not found' });
    
    const isMember = classroom.students?.some(id => id.toString() === req.user.id);
    const isRequested = classroom.requests?.some(id => id.toString() === req.user.id);

    if (isMember || isRequested) {
      return res.status(400).json({ message: 'Already a member or request pending' });
    }

    await Classroom.findByIdAndUpdate(req.params.id, {
      $push: { requests: req.user.id }
    });

    res.json({ message: 'Join request sent' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const handleJoinRequest = async (req, res) => {
  try {
    const { studentId, action } = req.body;
    const classroomId = req.params.id;

    // Remove from requests
    await Classroom.findByIdAndUpdate(classroomId, {
      $pull: { requests: studentId }
    });

    if (action === 'accept') {
      await Classroom.findByIdAndUpdate(classroomId, {
        $push: { students: studentId }
      });
    }

    res.json({ message: `Student ${action}ed` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAvailableClassrooms = async (req, res) => {
  try {
    const classrooms = await Classroom.find().populate('teacher', 'name');
    res.json(classrooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
