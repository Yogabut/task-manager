import express from 'express';
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// All user routes require authentication
router.use(protect);

// list users - allow admin and leader
router.get('/', authorizeRoles('admin', 'leader'), getUsers);

// create user - admin only
router.post('/', authorizeRoles('admin'), createUser);

// update user - admin or the user themselves (controller will enforce)
router.put('/:id', updateUser);

// delete user - admin only
router.delete('/:id', authorizeRoles('admin'), deleteUser);

export default router;
