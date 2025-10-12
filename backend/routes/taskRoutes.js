import express from 'express';
import { listTasks, createTask, updateTask, deleteTask } from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', protect, listTasks);
router.post('/', protect, authorizeRoles('admin', 'leader'), createTask);
router.put('/:id', protect, updateTask); // permission checked in controller
router.delete('/:id', protect, authorizeRoles('admin', 'leader'), deleteTask);

export default router;
