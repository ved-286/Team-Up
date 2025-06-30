import {Project} from '../models/ProjectModel.js';

export  const checkAccess = async ({projectId , userId}) =>{
    const project = await Project.findById(projectId);
    if (!project) {
        return { access: false, message: "Project not found" };
    }

    const isOwner = project.owner.toString() === userId;
  const isCollaborator = project.collaborators.includes(userId);

  if( !isOwner || !isCollaborator) {
        return { access: false, message: "You do not have access to this project" };
} 
 return { access: true, project };
}
    