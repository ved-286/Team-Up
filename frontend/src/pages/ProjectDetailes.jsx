// File: src/pages/Projects/ProjectDetails.jsx

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getProjectById,
  getTasksByProjectId,
} from "../services/ProjectService";
import { useAuth } from "../contexts/authContext";
import Avatar from "../components/Avatar";
import CreateTaskModal from "../components/CreateTaskModel";

const STATUS_COLORS = {
  "To Do": "from-pink-500 to-pink-700",
  "In Progress": "from-yellow-400 to-yellow-600",
  Review: "from-purple-500 to-purple-700",
  Done: "from-green-500 to-green-700",
};

const STATUS_LABEL_TO_VALUE = {
  "To Do": "todo",
  "In Progress": "in-progress",
  Review: "review",
  Done: "done",
};

const ProjectDetails = () => {
  const { projectId } = useParams();
  const { token } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskStatus, setTaskStatus] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null); // for edit

  // Load Project
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

    const fetchTasks = async () => {
      try {
        const data = await getTasksByProjectId(projectId, token);
        setTasks(data.tasks);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      }
    };

    fetchProject();
    fetchTasks();
  }, [projectId, token]);

  const getTaskByStatus = (label) => {
    const value = STATUS_LABEL_TO_VALUE[label];
    return tasks.filter((task) => task.status === value);
  };

 const handleTaskCreated = (newTask) => {
  // If assignedTo is just an ID, find the full user object from collaborators
  if (newTask.assignedTo && typeof newTask.assignedTo === "string") {
    const fullUser = project.collaborators?.find(
      (user) => user._id === newTask.assignedTo
    );

    if (fullUser) {
      newTask.assignedTo = fullUser; // 👈 overwrite with full object
    }
  }

  setTasks((prev) => [...prev, newTask]);
  setShowTaskModal(false);
  setSelectedTask(null);
};


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
            <Avatar email={project.email} size={28} />
            <span className="text-sm bg-blue-500/20 px-3 py-1 rounded text-blue-300">
              Admin: {project.owner?.username || "N/A"}
            </span>
          </div>

          {project.collaborators?.map((user) => (
            <span
              key={user._id}
              className="flex items-center space-x-1 bg-white/10 px-3 py-1 rounded text-sm"
            >
              <Avatar email={user.email} size={28} />
              <span>{user.username}</span>
            </span>
          ))}

          <span className="text-sm bg-green-500/20 px-3 py-1 rounded text-green-300">
            Created on: {new Date(project.createdAt).toLocaleDateString()}
          </span>
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
              <div
                className={`text-white text-center font-bold py-3 rounded-t-xl bg-gradient-to-r ${STATUS_COLORS[status]}`}
              >
                {status}
              </div>

              {/* Tasks */}
              {getTaskByStatus(status).length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  No tasks yet
                </div>
              ) : (
                <div className="flex-1 p-4 space-y-4">
                  {getTaskByStatus(status).map((task) => (
                    <div
                      key={task._id}
                      className="bg-white/10 p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                      onClick={() => {
                        setSelectedTask(task);
                        setTaskStatus(task.status); // maintain status
                        setShowTaskModal(true);
                      }}
                    >
                      <h3 className="text-lg font-semibold">{task.title}</h3>
                      <div className="mt-2 flex items-center space-x-2">
                        <Avatar email={task.assignedTo?.email} size={24} />
                        <span className="text-sm text-blue-300">
                          {task.assignedTo?.username || "Unassigned"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Task Button */}
              <button
                onClick={() => {
                  setShowTaskModal(true);
                  setTaskStatus(STATUS_LABEL_TO_VALUE[status]);
                  setSelectedTask(null); // reset if it's create mode
                }}
                className="mx-4 my-3 py-2 px-4 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 font-semibold shadow hover:bg-blue-500/30 hover:text-white hover:shadow-lg transition-all duration-200 flex items-center gap-2"
              >
                <span className="text-lg font-bold">+</span> Add Task
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showTaskModal && (
        <CreateTaskModal
          onClose={() => {
            setShowTaskModal(false);
            setSelectedTask(null);
          }}
          onTaskCreated={handleTaskCreated}
          projectId={project._id}
          status={taskStatus}
          mode={selectedTask ? "edit" : "create"}
          initialData={selectedTask}
        />
      )}
    </div>
  );
};

export default ProjectDetails;
