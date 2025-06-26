import { Task } from "../../models/TaskModel.js";

export const createTask = async (req, res) => {
    try {
        const { title, description, status, project, assignedTo, dueDate, priority } = req.body;
        if (!title || !project) {
            return res.status(400).json({ message: "Title and project are required" });
        }

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