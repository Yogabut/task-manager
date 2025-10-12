import Project from '../models/Project.js';
import Task from '../models/Task.js';

export const getCalendar = async (req, res) => {
  const user = req.user;
  let projectQuery = {};
  let taskQuery = {};

  if (user.role === 'admin') {
    // admin sees everything
    projectQuery = {};
    taskQuery = {};
  } else if (user.role === 'leader') {
    // leader: projects they lead or are member of, and tasks in those projects or assigned to them
    projectQuery = { $or: [{ leaderId: user._id }, { memberIds: user._id }] };
    taskQuery = { $or: [ { assigneeIds: user._id }, { projectId: { $in: (await Project.find(projectQuery)).map(p => p._id) } } ] };
  } else {
    // member: projects they are a member of, and tasks assigned to them
    projectQuery = { memberIds: user._id };
    taskQuery = { assigneeIds: user._id };
  }

  const projects = await Project.find(projectQuery).select('name startDate endDate leaderId memberIds progress');
  const tasks = await Task.find(taskQuery).select('title dueDate projectId assigneeIds status');

  res.json({ projects, tasks });
};

export default { getCalendar };
