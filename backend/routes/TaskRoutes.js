import express from 'express'
import { createTask,getTasks , updateTask , deleteTask , getTaskById } from '../controllers/TaskControllers/TaskController.js';
import { protect } from '../middlewares/authMiddleware.js';



const router = express();


router.post('/create', protect ,createTask)
router.get('/:projectId/tasks', protect,getTasks)
router.get('/:taskId', protect,getTaskById)
router.put('/update/:taskId', protect,updateTask)
router.delete('/delete/:taskId', protect,deleteTask)

export default router;