import express from 'express';
import { getProjects, createProject , addCollaborater } from '../controllers/TaskControllers/ProjectController.js'
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create',protect ,createProject);
router.get('/', protect ,getProjects);
router.put('/:projectId/collaborators', protect, addCollaborater);

export default router;