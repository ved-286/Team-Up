// File: src/pages/Projects/ProjectDetails.jsx

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getProjectById,
  getTasksByProjectId,
} from "../services/ProjectService";
import { deleteTask, updateTask } from '../services/Taskservice';
import { useAuth } from '../contexts/authContext';
import Avatar from '../components/Avatar';
import CreateTaskModal from '../components/CreateTaskModel';
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

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
  const [selectedTask, setSelectedTask] = useState(null);
  const [viewTask, setViewTask] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (isDragging) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDragging]);

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
    if (newTask.assignedTo && typeof newTask.assignedTo === "string") {
      const fullUser = project.collaborators?.find(
        (user) => user._id === newTask.assignedTo
      );
      if (fullUser) newTask.assignedTo = fullUser;
    }
    setTasks((prev) => [...prev, newTask]);
    setShowTaskModal(false);
    setSelectedTask(null);
  };

  const handleTaskUpdated = (updatedTask) => {
    if (
      updatedTask.assignedTo &&
      typeof updatedTask.assignedTo === "string" &&
      project?.collaborators
    ) {
      const fullUser = project.collaborators.find(
        (user) => user._id === updatedTask.assignedTo
      );
      if (fullUser) updatedTask.assignedTo = fullUser;
    }

    setTasks((prev) =>
      prev.map((task) => (task._id === updatedTask._id ? updatedTask : task))
    );

    setShowTaskModal(false);
    setSelectedTask(null);
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      setTasks((prev) => prev.filter((task) => task._id !== taskId)); // Optimistic UI
      await deleteTask(taskId, token);
    } catch (err) {
      console.error("Failed to delete task:", err);
      alert("Failed to delete task.");
    }
  };

  const handleDragStart = () => setIsDragging(true);
  const handleDragEnd = async (result) => {
    setIsDragging(false);
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;

    const task = tasks.find((t) => t._id === draggableId);
    if (!task) return;

    const newStatus = destination.droppableId;
    const updatedTask = { ...task, status: newStatus };

    setTasks((prev) =>
      prev.map((t) => (t._id === task._id ? updatedTask : t))
    );

    try {
      await updateTask(task._id, { status: newStatus }, token);
    } catch (err) {
      console.error("Failed to update task status:", err);
    }
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
        </div>
      </div>

      {/* Kanban Board */}
      <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-lg max-h-[75vh] overflow-x-auto p-6">
        <h2 className="text-xl font-semibold mb-6">Project Tasks</h2>
        <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Object.keys(STATUS_COLORS).map((statusLabel) => {
              const statusValue = STATUS_LABEL_TO_VALUE[statusLabel];
              const columnTasks = getTaskByStatus(statusLabel);

              return (
                <Droppable droppableId={statusValue} key={statusValue}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-lg shadow-xl flex flex-col"
                    >
                      <div
                        className={`text-white text-center font-bold py-3 rounded-t-xl bg-gradient-to-r ${STATUS_COLORS[statusLabel]}`}
                      >
                        {statusLabel}
                      </div>

                      <div className="flex-1 p-4 space-y-4 min-h-[100px]">
                        {columnTasks.map((task, index) => (
                          <Draggable
                            draggableId={task._id}
                            index={index}
                            key={task._id}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-white/10 p-4 rounded-lg shadow transition-shadow duration-200 group relative ${
                                  snapshot.isDragging
                                    ? "scale-105 z-50 shadow-xl cursor-grabbing"
                                    : ""
                                }`}
                              >
                                <h3 className="text-lg font-semibold">
                                  {task.title}
                                </h3>
                                <div className="flex items-center space-x-2 text-sm text-blue-300 mt-2">
                                  <Avatar email={task.assignedTo?.email} size={24} />
                                  <span>
                                    {task.assignedTo?.username || "Unassigned"}
                                  </span>
                                </div>

                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex space-x-2">
                                  <button
                                    className="text-yellow-400 hover:text-yellow-300"
                                    onClick={() => {
                                      setSelectedTask(task);
                                      setTaskStatus(task.status);
                                      setShowTaskModal(true);
                                    }}
                                    title="Edit"
                                  >
                                    ✏️
                                  </button>
                                  <button
                                    className="text-red-400 hover:text-red-300"
                                    onClick={() => handleDeleteTask(task._id)}
                                    title="Delete"
                                  >
                                    🗑
                                  </button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>

                      <button
                        onClick={() => {
                          setShowTaskModal(true);
                          setTaskStatus(statusValue);
                          setSelectedTask(null);
                        }}
                        className="mx-4 my-3 py-2 px-4 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 font-semibold shadow hover:bg-blue-500/30 hover:text-white hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                      >
                        <span className="text-lg font-bold">+</span> Add Task
                      </button>
                    </div>
                  )}
                </Droppable>
              );
            })}
          </div>
        </DragDropContext>
      </div>

      {/* Modals */}
      {viewTask && (
        <CreateTaskModal
          mode="view"
          onClose={() => setViewTask(null)}
          projectId={project._id}
          initialData={viewTask}
        />
      )}

      {showTaskModal && (
        <CreateTaskModal
          onClose={() => {
            setShowTaskModal(false);
            setSelectedTask(null);
          }}
          mode={selectedTask ? "edit" : "create"}
          onTaskCreated={handleTaskCreated}
          onTaskUpdated={handleTaskUpdated}
          projectId={project._id}
          status={taskStatus}
          initialData={selectedTask}
        />
      )}
    </div>
  );
};

export default ProjectDetails;
