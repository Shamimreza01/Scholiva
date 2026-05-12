import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  visibility: { type: String, enum: ['public', 'protected', 'private'], default: 'public' },
  classroomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  shares: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isShared: { type: Boolean, default: false },
  parentPost: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  comments: [commentSchema]
}, { timestamps: true });

export default mongoose.model('Post', postSchema);
