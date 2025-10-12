import User from '../models/User.js';

export const getUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};

export const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'User exists' });
  const user = await User.create({ name, email, password, role });
  res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role });
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  if (updates.password) delete updates.password; // password change via separate flow
  // allow admin or the user themselves
  const requester = req.user;
  if (!(requester.role === 'admin' || requester._id.toString() === id)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const user = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  await User.findByIdAndDelete(id);
  res.json({ message: 'User removed' });
};
