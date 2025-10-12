import Task from '../models/Task.js';
import Project from '../models/Project.js';

// normalize assigneeIds coming from clients
const parseAssigneeIds = (raw) => {
  if (!raw) return [];
  let ids = raw;
  // sometimes clients send a JSON-stringified array or comma-separated string
  if (typeof ids === 'string') {
    // try JSON.parse first
    try {
      const parsed = JSON.parse(ids);
      if (Array.isArray(parsed)) ids = parsed;
    } catch (e) {
      // fallback: comma-separated
      ids = ids.split(',').map(s => s.trim()).filter(Boolean);
    }
  }
  if (!Array.isArray(ids)) ids = [ids];
  // remove falsy / empty entries
  ids = ids.filter(Boolean);
  return ids;
};

export const listTasks = async (req, res) => {
  const { projectId } = req.query;
  const query = {};
  if (projectId) query.projectId = projectId;
  const tasks = await Task.find(query).populate('assigneeIds', 'name email').populate('projectId', 'name');
  res.json(tasks);
};

export const createTask = async (req, res) => {
  const { title, projectId, description, priority, assigneeIds: rawAssignees, dueDate } = req.body;
  if (!title || !projectId) return res.status(400).json({ message: 'Missing fields' });
  // ensure project exists
  const project = await Project.findById(projectId);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  const assigneeIds = parseAssigneeIds(rawAssignees);
  const task = await Task.create({ title, projectId, description, priority, assigneeIds, dueDate });

  // recalc project progress
  const tasks = await Task.find({ projectId });
  const mapStatus = (s) => (s === 'todo' ? 0 : s === 'in-progress' ? 25 : s === 'review' ? 75 : 100);
  const pct = Math.round(tasks.reduce((acc, t) => acc + mapStatus(t.status), 0) / Math.max(tasks.length, 1));
  project.progress = pct;
  await project.save();

  res.status(201).json(task);
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const task = await Task.findById(id);
  if (!task) return res.status(404).json({ message: 'Task not found' });

  // check permissions: leader of project, or assignee, or admin
  const project = await Project.findById(task.projectId);
  const user = req.user;
  const isAssignee = task.assigneeIds.some(a => a.toString() === user._id.toString());
  if (!(user.role === 'admin' || project.leaderId.toString() === user._id.toString() || isAssignee)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  // sanitize assigneeIds if present
  if (updates && Object.prototype.hasOwnProperty.call(updates, 'assigneeIds')) {
    updates.assigneeIds = parseAssigneeIds(updates.assigneeIds);
  }
  Object.assign(task, updates);
  await task.save();
  // recalc project progress
  const projectTasks = await Task.find({ projectId: task.projectId });
  const mapStatus = (s) => (s === 'todo' ? 0 : s === 'in-progress' ? 25 : s === 'review' ? 75 : 100);
  const pct = Math.round(projectTasks.reduce((acc, t) => acc + mapStatus(t.status), 0) / Math.max(projectTasks.length, 1));
  const proj = await Project.findById(task.projectId);
  if (proj) {
    proj.progress = pct;
    await proj.save();
  }

  const populated = await Task.findById(task._id).populate('assigneeIds', 'name email').populate('projectId', 'name');
  res.json(populated);
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  const project = await Project.findById(task.projectId);
  const user = req.user;
  if (!(user.role === 'admin' || project.leaderId.toString() === user._id.toString())) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const projectId = task.projectId;
  await Task.findByIdAndDelete(id);

  // recalc project progress after deletion
  const projectTasks = await Task.find({ projectId });
  const mapStatus = (s) => (s === 'todo' ? 0 : s === 'in-progress' ? 25 : s === 'review' ? 75 : 100);
  const pct = Math.round(projectTasks.reduce((acc, t) => acc + mapStatus(t.status), 0) / Math.max(projectTasks.length, 1));
  const proj = await Project.findById(projectId);
  if (proj) {
    proj.progress = pct;
    await proj.save();
  }

  res.json({ message: 'Task removed' });
};
