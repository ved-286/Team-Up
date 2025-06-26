import express from 'express'
import { createTask,getTasks } from '../controllers/TaskControllers/TaskController.js';
import { protect } from '../middlewares/authMiddleware.js';



const router = express();


router.post('/create', protect ,createTask)
router.get('/:projectId', protect,getTasks)

export default router;