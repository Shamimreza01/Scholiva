const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const User = require('../models/User');

// Cloudinary Config (User needs to provide these in .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.uploadMiddleware = upload.single('profilePicture');

exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, education, twitter, linkedin, github } = req.body;
    let profilePictureUrl = '';

    // Check if Cloudinary is configured before attempting upload
    if (req.file) {
      if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        throw new Error("Cloudinary credentials are not configured in .env");
      }
      
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "educonnect_profiles",
      });
      profilePictureUrl = result.secure_url;
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (bio) updateData.bio = bio;
    if (education) updateData.education = education;
    if (profilePictureUrl) updateData.profilePicture = profilePictureUrl;
    
    updateData.socialLinks = {
      twitter: twitter || '',
      linkedin: linkedin || '',
      github: github || ''
    };

    // Remove undefined fields so they don't overwrite existing data
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    console.error("Profile Update Error:", err);
    res.status(500).json({ 
      message: err.message,
      error: err.name
    });
  }
};

exports.getTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' }).select('-password');
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.requestConnection = async (req, res) => {
  try {
    const teacher = await User.findById(req.params.id);
    if (!teacher || teacher.role !== 'teacher') return res.status(404).json({ message: 'Teacher not found' });

    if (teacher.pendingConnections.includes(req.user.id) || teacher.connections.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already requested or connected' });
    }

    teacher.pendingConnections.push(req.user.id);
    await teacher.save();
    res.json({ message: 'Connection request sent' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.handleConnectionRequest = async (req, res) => {
  try {
    const { studentId, action } = req.body;
    const teacher = await User.findById(req.user.id);

    teacher.pendingConnections = teacher.pendingConnections.filter(id => id.toString() !== studentId);

    if (action === 'approve') {
      teacher.connections.push(studentId);
      // Also add teacher to student's connections
      await User.findByIdAndUpdate(studentId, { $push: { connections: req.user.id } });
    }

    await teacher.save();
    res.json({ message: `Connection ${action}d` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getStudentLearningStats = async (req, res) => {
  try {
    const Classroom = require('../models/Classroom');
    const Quiz = require('../models/Quiz');
    const Submission = require('../models/Submission');

    const classrooms = await Classroom.find({ students: req.user.id })
      .populate('teacher', 'name profilePicture');

    const submissions = await Submission.find({ student: req.user.id })
      .populate('quiz', 'title questions duration')
      .sort({ createdAt: -1 });

    // Separate MCQ and Short Question stats
    let mcqStats = { count: 0, totalScore: 0, avgScore: 0 };
    let shortStats = { count: 0, completed: 0 };

    submissions.forEach(sub => {
      const hasShort = sub.quiz.questions.some(q => q.type === 'short');
      const hasMCQ = sub.quiz.questions.some(q => q.type === 'mcq');

      if (hasMCQ) {
        mcqStats.count++;
        mcqStats.totalScore += sub.score;
      }
      if (hasShort) {
        shortStats.count++;
        shortStats.completed++;
      }
    });
    mcqStats.avgScore = mcqStats.count > 0 ? mcqStats.totalScore / mcqStats.count : 0;

    const classroomStats = await Promise.all(classrooms.map(async (cls) => {
      const quizzes = await Quiz.find({ classroomId: cls._id });
      const quizIds = quizzes.map(q => q._id);
      const allSubmissions = await Submission.find({ quiz: { $in: quizIds } });
      
      const studentMap = new Map();
      allSubmissions.forEach(sub => {
        const sId = sub.student.toString();
        studentMap.set(sId, (studentMap.get(sId) || 0) + sub.score);
      });

      const sortedStudents = Array.from(studentMap.entries()).sort((a, b) => b[1] - a[1]);
      const rank = sortedStudents.findIndex(s => s[0] === req.user.id) + 1;

      return {
        _id: cls._id,
        name: cls.name,
        teacher: cls.teacher,
        rank: rank || 'N/A',
        totalStudents: cls.students.length,
        myScore: studentMap.get(req.user.id) || 0
      };
    }));

    res.json({
      classrooms: classroomStats,
      submissions,
      mcqStats,
      shortStats,
      overall: {
        total: submissions.length,
        avgScore: mcqStats.avgScore
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
