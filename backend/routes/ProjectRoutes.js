import express from 'express';
import { getProjects, createProject , addCollaborater , getProjectById } from '../controllers/TaskControllers/ProjectController.js'
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create',protect ,createProject);
router.get('/', protect ,getProjects);
router.post('/:projectId/collaborators', protect, addCollaborater);
router.get('/:projectId', protect, getProjectById);

export default router;