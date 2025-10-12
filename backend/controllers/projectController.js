import Project from '../models/Project.js';

export const listProjects = async (req, res) => {
  const user = req.user;
  let query = {};
  if (user.role === 'leader') {
    // leaders should see projects they lead or are a member of
    query = { $or: [{ leaderId: user._id }, { memberIds: user._id }] };
  } else if (user.role === 'member') {
    query = { memberIds: user._id };
  }
  const projects = await Project.find(query).populate('leaderId', 'name email role').populate('memberIds', 'name email');
  res.json(projects);
};

export const createProject = async (req, res) => {
  const { name, description, leaderId, memberIds, startDate, endDate, status } = req.body;
  if (!name || !leaderId) return res.status(400).json({ message: 'Missing required fields' });
  const project = await Project.create({ name, description, leaderId, memberIds, startDate, endDate, status });
  res.status(201).json(project);
};

export const updateProject = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const project = await Project.findByIdAndUpdate(id, updates, { new: true }).populate('leaderId', 'name email role').populate('memberIds', 'name email');
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json(project);
};

export const deleteProject = async (req, res) => {
  const { id } = req.params;
  const project = await Project.findById(id);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  await Project.findByIdAndDelete(id);
  res.json({ message: 'Project removed' });
};
