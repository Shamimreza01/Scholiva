import mongoose from 'mongoose';

const classroomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  admissionQuestions: { type: [String], default: [] }, // Questions for joining
  requests: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    answers: [{ type: String }],
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
  }],
}, { timestamps: true });

export default mongoose.model('Classroom', classroomSchema);
