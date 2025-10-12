import express from 'express';
import { listProjects, createProject, updateProject, deleteProject } from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', protect, listProjects);
router.post('/', protect, authorizeRoles('admin', 'leader'), createProject);
router.put('/:id', protect, authorizeRoles('admin', 'leader'), updateProject);
router.delete('/:id', protect, authorizeRoles('admin'), deleteProject);

export default router;
