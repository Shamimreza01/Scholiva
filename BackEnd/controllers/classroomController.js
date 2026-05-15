import Classroom from '../models/Classroom.js';
import User from '../models/User.js';
import Quiz from '../models/Quiz.js';
import Submission from '../models/Submission.js';
import Post from '../models/Post.js';

export const createClassroom = async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can create classrooms' });
    }
    const { name, description, admissionQuestions } = req.body;
    const classroom = new Classroom({
      name,
      description,
      admissionQuestions: admissionQuestions || [],
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
      .populate({ path: 'students', select: 'name email profilePicture', model: 'User' })
      .populate({ path: 'requests.student', select: 'name email profilePicture', model: 'User' });
    res.json(classrooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getClassroomById = async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id)
      .populate('teacher', 'name profilePicture')
      .populate({ path: 'students', select: 'name email profilePicture', model: 'User' })
      .populate({ path: 'requests.student', select: 'name email profilePicture', model: 'User' });
    
    if (!classroom) return res.status(404).json({ message: 'Classroom not found' });
    
    const isTeacher = classroom.teacher._id.toString() === req.user.id;
    const isStudent = classroom.students.some(s => s._id.toString() === req.user.id);
    
    if (!isTeacher && !isStudent) {
      // Return public info if not member
      return res.json({
        _id: classroom._id,
        name: classroom.name,
        description: classroom.description,
        teacher: classroom.teacher,
        isMember: false,
        hasRequested: classroom.requests.some(r => r.student._id.toString() === req.user.id),
        admissionQuestions: classroom.admissionQuestions
      });
    }

    // Fetch Quizzes and Posts for this classroom
    const quizzes = await Quiz.find({ classroomId: req.params.id }).sort({ createdAt: -1 });
    const posts = await Post.find({ classroomId: req.params.id }).populate('teacher', 'name profilePicture').sort({ createdAt: -1 });

    // Calculate student rank if student
    let myRank = null;
    if (isStudent) {
      const allQuizzes = await Quiz.find({ classroomId: req.params.id }).select('_id');
      const quizIds = allQuizzes.map(q => q._id);
      const allSubmissions = await Submission.find({ quiz: { $in: quizIds } });
      
      const studentMap = new Map();
      allSubmissions.forEach(sub => {
        const sId = sub.student.toString();
        studentMap.set(sId, (studentMap.get(sId) || 0) + sub.score);
      });

      const sortedStudents = Array.from(studentMap.entries()).sort((a, b) => b[1] - a[1]);
      myRank = sortedStudents.findIndex(s => s[0] === req.user.id) + 1;
    }

    res.json({
      ...classroom.toObject(),
      isMember: true,
      myRank: myRank || 'N/A',
      quizzes,
      posts
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const requestToJoin = async (req, res) => {
  try {
    const { answers } = req.body;
    const classroom = await Classroom.findById(req.params.id);
    if (!classroom) return res.status(404).json({ message: 'Classroom not found' });
    
    const isMember = classroom.students?.some(id => id.toString() === req.user.id);
    const isRequested = classroom.requests?.some(r => r.student.toString() === req.user.id);

    if (isMember || isRequested) {
      return res.status(400).json({ message: 'Already a member or request pending' });
    }

    classroom.requests.push({
      student: req.user.id,
      answers: answers || []
    });

    await classroom.save();
    res.json({ message: 'Join request sent' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const handleJoinRequest = async (req, res) => {
  try {
    const { studentId, action } = req.body; // action: 'accept' or 'reject'
    const classroom = await Classroom.findById(req.params.id);

    if (!classroom || classroom.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Filter out the request
    classroom.requests = classroom.requests.filter(r => r.student.toString() !== studentId);

    if (action === 'accept') {
      const alreadyIn = classroom.students.some(id => id.toString() === studentId);
      if (!alreadyIn) {
        classroom.students.push(studentId);
      }
    }

    await classroom.save();
    res.json({ message: `Student request ${action}ed` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAvailableClassrooms = async (req, res) => {
  try {
    const classrooms = await Classroom.find().populate('teacher', 'name profilePicture');
    res.json(classrooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getClassroomRankings = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ classroomId: req.params.id });
    const quizIds = quizzes.map(q => q._id);

    const submissions = await Submission.find({ quiz: { $in: quizIds } })
      .populate('student', 'name profilePicture')
      .sort({ score: -1 });

    const studentMap = new Map();
    submissions.forEach(r => {
      if (!r.student) return;
      const sId = r.student._id.toString();
      if (!studentMap.has(sId)) {
        studentMap.set(sId, {
          name: r.student.name,
          profilePicture: r.student.profilePicture,
          totalScore: r.score,
          quizzesTaken: 1,
          avgScore: r.score
        });
      } else {
        const stats = studentMap.get(sId);
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
