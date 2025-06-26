import { Project } from "../../models/ProjectModel.js"


export const createProject = async (req, res) => {
    try{
        const { title , description} = req.body;
        const project = await Project.create({
            title: title,
            description: description,
            owner: req.user.userId,
        })

        if (!project) {
            return res.status(400).json({ message: "Project creation failed" });
        }
        return res.status(201).json({ message: "Project created successfully", project });
    }catch (error) {
        console.error("Error creating project:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getProjects = async (req, res) => {
    try{
        const projects = await Project.find({
            $or: [
                { owner: req.user.userId },
                { collaborators: req.user.userId }
            ]
         }).populate("owner", "username email").populate("collaborators", "username email");

         

        if (!projects || projects.length === 0) {
            return res.status(404).json({ message: "No projects found" });
        }
        
        return res.status(200).json({ message: "Projects fetched successfully", projects });
    }catch (error) {
        console.error("Error fetching projects:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const addCollaborater = async (req, res) => {
     const {projectId } = req.params;
        const { collaboratorEmail } = req.body;
    try {
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Check if the user is the owner of the project
        if (project.owner.toString() !== req.user.userId) {
            return res.status(403).json({ message: "You are not authorized to add collaborators to this project" });
        }

        const userToadd = await User.findOne({ email: collaboratorEmail });
        if (!userToadd) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the user is already a collaborator
        if (project.collaborators.includes(userToadd._id)) {
            return res.status(400).json({ message: "User is already a collaborator" });
        }
        // Add the user to the collaborators array
        project.collaborators.push(userToadd._id);  
        await project.save();
        return res.status(200).json({ message: "Collaborator added successfully", project });


    }catch(error) {
        console.error("Error adding collaborator:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}