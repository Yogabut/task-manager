import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['planning', 'in-progress', 'completed', 'on-hold'], default: 'planning' },
  progress: { type: Number, default: 0 },
  leaderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  memberIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  startDate: Date,
  endDate: Date,
}, { timestamps: true });

// When a project is removed, delete its tasks
projectSchema.pre('remove', async function (next) {
  try {
    const Task = mongoose.model('Task');
    await Task.deleteMany({ projectId: this._id });
    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model('Project', projectSchema);
