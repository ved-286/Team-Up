import { Task } from "../../models/TaskModel.js";
import { checkAccess} from '../../utils/checkAccess.js'

export const createTask = async (req, res) => {
    try {
        const { title, description, status, project, assignedTo, dueDate, priority } = req.body;
        if (!title || !project) {
            return res.status(400).json({ message: "Title and project are required" });
        }
        //   const { access, message } = await checkAccess(project, req.user.userId);
        //     if (!access) return res.status(403).json({ message });
        const task = await Task.create({
            title,
            description,
            status: status || 'todo',
            project,
            assignedTo,
            createdBy: req.user.userId,
            dueDate,
            priority: priority || 'medium',
        });

        if (!task) {
            return res.status(400).json({ message: "Task creation failed" });
        }
        return res.status(201).json({ message: "Task created successfully", task });
    } catch (error) {
        console.error("Error creating task:", error);
        return res.status(500).json({ message: "aashvi rand" });
        
    }
}

export const getTasks = async (req, res) => {
    try {
       const { projectId } = req.params;
    //    const { access, message } = await checkAccess(projectId, req.user.userId);
    //     if (!access) return res.status(403).json({ message });
        if (!projectId) {
            return res.status(400).json({ message: "Project ID is required" });
        }
        const tasks = await Task.find({
           project: projectId,
           
        }).populate('assignedTo',"username email")
          
       
        return res.status(200).json({ message: "Tasks fetched successfully", tasks });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const updateTask = async (req, res) => {
    try {
        const  { taskId } = req.params;
        const updates = req.body;
 
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        const hasAccess = await checkAccess(req.user.userId, task.project);
        if (!hasAccess) {
            return res.status(403).json({ message: "Access denied" });
        }

        const allowedUpdates = ['title', 'description', 'status', 'assignedTo', 'dueDate', 'priority'];
        for (let key of Object.keys(updates)) {
            if (allowedUpdates.includes(key)) {
                task[key] = updates[key];
            }
        }
        const updatedTask = await task.save();
        return res.status(200).json({ message: "Task updated successfully", task: updatedTask });


    }catch (error) {
        console.error("Error updating task:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        const hasAccess = await checkAccess(req.user.userId, task.project);
        if (!hasAccess) {
            return res.status(403).json({ message: "Access denied" });
        }

        await task.deleteOne();
        return res.status(200).json({ message: "Task deleted successfully" });
        
    } catch (error) {
        console.error("Error deleting task:", error);
        return res.status(500).json({ message: "Internal server error" });
        
    }
}

export const getTaskById = async (req, res) => {
    try {
        const { taskId } = req.params;
        const task = await Task.findById(taskId).populate('assignedTo', 'username email');
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        const hasAccess = await checkAccess(req.user.userId, task.project);
        if (!hasAccess) {
            return res.status(403).json({ message: "Access denied" });
        }

        return res.status(200).json({ message: "Task fetched successfully", task });
        
    } catch (error) {
        console.error("Error fetching task by ID:", error);
        return res.status(500).json({ message: "Internal server error" });
        
    }
}