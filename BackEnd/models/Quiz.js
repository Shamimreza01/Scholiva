import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  visibility: { 
    type: String, 
    enum: ['public', 'protected', 'private'], 
    default: 'public' 
  },
  classroomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom' },
  questions: [{
    question: { type: String, required: true },
    type: { type: String, enum: ['mcq', 'short'], default: 'mcq' },
    options: [{ type: String }], // Optional for short questions
    answer: { type: String, required: true } // For short, this can be keywords or a model answer
  }],
  duration: { type: Number, required: true }, // in seconds
  negativeMarking: { type: Number, default: 0.5 },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Students who entered
  results: [{
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    score: Number,
    submittedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.model('Quiz', quizSchema);
