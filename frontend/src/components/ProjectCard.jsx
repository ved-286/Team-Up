import React from "react";
import { useNavigate } from "react-router-dom";

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();
  const ownerName = project.owner.username || project.owner.email;
  const ownerInitial = ownerName[0]?.toUpperCase();

  return (
    <div
      className="border bg-[#161B22] border-[#2D333B] text-[#EDEDED] hover:shadow-lg hover:scale-[1.02] transition-all h-50 rounded-lg p-5 cursor-pointer duration-200 flex flex-col justify-between"
      onClick={() => navigate(`/projects/${project._id}`)}
    >
      <div>
        <h2 className="text-xl font-semibold mb-1">{project.title}</h2>
        <p className="text-sm mt-1 mb-4 line-clamp-3">{project.description}</p>
      </div>
      <div className="flex items-center justify-between mt-auto">
        <span className="text-xs text-gray-400">
          Created on: {new Date(project.createdAt).toLocaleDateString()}
        </span>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg shadow">
            {ownerInitial}
          </div>
          <span className="text-sm font-medium truncate max-w-[100px]">{ownerName}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;