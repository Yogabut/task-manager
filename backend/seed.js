import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';

dotenv.config();

const seed = async () => {
  await connectDB();

  const users = [
    { name: 'Admin', email: 'admin@example.com', password: 'password123', role: 'admin' },
    { name: 'Leader', email: 'leader@example.com', password: 'password123', role: 'leader' },
    { name: 'Member', email: 'member@example.com', password: 'password123', role: 'member' },
  ];

  for (const u of users) {
    const exists = await User.findOne({ email: u.email });
    if (!exists) {
      await User.create(u);
      console.log('Created user', u.email);
    } else {
      console.log('User exists', u.email);
    }
  }

  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
