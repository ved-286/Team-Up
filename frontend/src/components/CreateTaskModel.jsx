import { useEffect, useState } from "react";
import { createTask, updateTask, getTaskById } from "../services/Taskservice";
import { getAllUsers } from "../services/authService";
import Avatar from "./Avatar";
import { useAuth } from "../contexts/authContext";

const CreateTaskModal = ({
  onClose,
  projectId,
  status,
  onTaskCreated,
  onTaskUpdated,
  mode = "create",
  initialData = {},
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assignee, setAssignee] = useState("");
  const [users, setUsers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers(token);
        setUsers(Array.isArray(data) ? data : data.users || []);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchUsers();
  }, [token]);

  // Fetch task details in view mode
  useEffect(() => {
    const fetchTask = async () => {
      if ((mode === "view" || mode === "edit") && initialData?._id) {
        try {
          const res = await getTaskById(initialData._id, token);
          const task = res.task;
          setTitle(task.title);
          setDescription(task.description);
          setDueDate(task.dueDate?.substring(0, 10));
          setPriority(task.priority);
          setAssignee(task.assignedTo?._id || "");
        } catch (err) {
          console.error("Error fetching task by ID:", err);
        }
      }
    };
    fetchTask();
  }, [mode, initialData, token]);

  const selectedUser = users.find((u) => u._id === assignee);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === "view") return;

    setLoading(true);
    const taskData = {
      title,
      description,
      dueDate,
      priority,
      status,
      project: projectId,
      assignedTo: assignee || null,
    };

    try {
      if (mode === "edit" && initialData?._id) {
        const updated = await updateTask(initialData._id, taskData, token);
        onTaskUpdated?.(updated.task);
      } else {
        const created = await createTask(taskData, token);
        onTaskCreated?.(created.task);
      }
      onClose(); // ✅ Close on success
    } catch (error) {
      console.error("Failed to submit task:", error);
    } finally {
      setLoading(false);
    }
  };

  const isReadOnly = mode === "view";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-[#161B22] border border-white/10 p-6 rounded-lg w-[90%] max-w-2xl text-white space-y-4"
      >
        <h2 className="text-2xl font-bold mb-4">
          {mode === "edit"
            ? "Edit Task"
            : mode === "view"
            ? "Task Details"
            : "Create Task"}
        </h2>

        {/* Title & Due Date */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm mb-1">Title</label>
            <input
              type="text"
              className="w-full bg-white/10 border border-white/20 rounded px-3 py-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isReadOnly}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm mb-1">Due Date</label>
            <input
              type="date"
              className="w-full bg-white/10 border border-white/20 rounded px-3 py-2"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={isReadOnly}
            />
          </div>
        </div>

        {/* Priority & Assignee */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded px-3 py-2"
              disabled={isReadOnly}
            >
              <option>low</option>
              <option>medium</option>
              <option>high</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm mb-1">Assign To</label>
            {isReadOnly ? (
              <div className="flex items-center bg-white/10 px-3 py-2 rounded border border-white/20">
                {selectedUser ? (
                  <>
                    <Avatar email={selectedUser.email} size={24} />
                    <span className="ml-2">
                      {selectedUser.username}
                      {selectedUser._id === user._id ? " (Me)" : ""}
                    </span>
                  </>
                ) : (
                  <span className="text-gray-400">Unassigned</span>
                )}
              </div>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  className="w-full flex items-center bg-white/10 border border-white/20 rounded px-3 py-2"
                  onClick={() => setShowDropdown((v) => !v)}
                >
                  {selectedUser ? (
                    <>
                      <Avatar email={selectedUser.email} size={24} />
                      <span className="ml-2">
                        {selectedUser.username}
                        {selectedUser._id === user._id ? " (Me)" : ""}
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-400">Unassigned</span>
                  )}
                  <svg
                    className="ml-auto w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {showDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-[#161B22] border border-white/20 rounded shadow-lg max-h-48 overflow-y-auto">
                    <div
                      className="flex items-center px-3 py-2 cursor-pointer hover:bg-white/10"
                      onClick={() => {
                        setAssignee("");
                        setShowDropdown(false);
                      }}
                    >
                      <span className="text-gray-400">Unassigned</span>
                    </div>
                    {users.map((u) => (
                      <div
                        key={u._id}
                        className="flex items-center px-3 py-2 cursor-pointer hover:bg-white/10"
                        onClick={() => {
                          setAssignee(u._id);
                          setShowDropdown(false);
                        }}
                      >
                        <Avatar email={u.email} size={24} />
                        <span className="ml-2">
                          {u.username}
                          {u._id === user._id ? " (Me)" : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm mb-1">Description</label>
          <textarea
            className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 min-h-[80px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isReadOnly}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-white/10 text-gray-300 hover:bg-white/20"
          >
            {mode === "view" ? "Close" : "Cancel"}
          </button>
          {mode !== "view" && (
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {mode === "edit" ? "Update" : "Create"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateTaskModal;
