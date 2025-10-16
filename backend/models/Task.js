import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['todo', 'in-progress', 'review', 'done'], default: 'todo' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  assigneeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  dueDate: Date,
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);
