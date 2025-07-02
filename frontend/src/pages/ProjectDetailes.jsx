// File: src/pages/Projects/ProjectDetails.jsx

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProjectById } from "../services/ProjectService";
import { useAuth } from "../contexts/authContext";
import { FaUserCircle } from "react-icons/fa";
import Avatar from "../components/Avatar";

const STATUS_COLORS = {
  "To Do": "from-pink-500 to-pink-700",
  "In Progress": "from-yellow-400 to-yellow-600",
  Review: "from-purple-500 to-purple-700",
  Done: "from-green-500 to-green-700",
};

const ProjectDetails = () => {
  const { projectId } = useParams();
  const { token } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await getProjectById(projectId, token);
        setProject(data.project);
      } catch (err) {
        console.error("Failed to fetch project:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, token]);

  if (loading) return <div className="text-gray-400">Loading...</div>;
  if (!project) return <div className="text-red-500">Project not found</div>;

  return (
    <div className="text-white space-y-6">
      {/* Project Info */}
      <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
        <p className="text-gray-400">{project.description}</p>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            {/* <FaUserCircle className="text-blue-400 text-xl" /> */}
            <Avatar email={project.email} size={28} />
            <span className="text-sm bg-blue-500/20 px-3 py-1 rounded text-blue-300">
              Admin: {project.owner?.username || "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {project.collaborators?.map((user) => (
              <span
                key={user._id}
                className="flex items-center space-x-1 bg-white/10 px-3 py-1 rounded text-sm"
              >
                {/* <FaUserCircle className="text-white text-base" /> */}
                 <Avatar email={user.email} size={28} />
                <span>{user.username}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Project Tasks</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.keys(STATUS_COLORS).map((status) => (
            <div
              key={status}
              className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-lg shadow-xl flex flex-col"
            >
              {/* Neon Header */}
              <div
                className={`text-white text-center font-bold py-3 rounded-t-xl bg-gradient-to-r ${STATUS_COLORS[status]}`}
              >
                {status}
              </div>

              {/* Task Placeholder */}
              <div className="p-4 flex-1">
                <div className="bg-white/10 text-sm text-gray-400 p-3 rounded-md border border-white/10">
                  No tasks yet
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
