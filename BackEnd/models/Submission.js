const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  answers: [{
    questionIndex: Number,
    selectedOption: String, // For MCQ
    shortAnswer: String,    // For Short Questions
    isCorrect: { type: Boolean, default: false }
  }],
  score: { type: Number, required: true },
  accuracy: { type: Number },
  timeTaken: { type: Number } // in seconds
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);
