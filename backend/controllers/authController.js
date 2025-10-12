import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!email || !password || !name) return res.status(400).json({ message: 'Missing fields' });
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  // If someone tries to register as admin, validate invite token from env
  if (role === 'admin') {
    const { adminInviteToken } = req.body;
    if (!process.env.ADMIN_INVITE_TOKEN) {
      return res.status(500).json({ message: 'Server misconfigured: ADMIN_INVITE_TOKEN missing' });
    }
    if (!adminInviteToken || String(adminInviteToken) !== String(process.env.ADMIN_INVITE_TOKEN)) {
      return res.status(403).json({ message: 'Invalid admin invite token' });
    }
  }

  const user = await User.create({ name, email, password, role });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

export const getMe = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  res.json(req.user);
};
