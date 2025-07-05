import React from "react";
import { createTask } from "../services/Taskservice";
import {useAuth} from "../contexts/authContext";


const AddTaskButton = ({ status,projectId, onTaskAdded }) => {
    const { token , user } = useAuth();
    const [title, setTitle] = React.useState("");
    const [showForm, setShowForm] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        setLoading(true);
        try {
            const newTask ={
                title,
                status,
                project: projectId,
                assignedTo: user._id,
            };
            const created = await createTask(newTask, token);
            onTaskAdded(created.task);
            setTitle("");
            setShowForm(false);
            console.log("Task added successfully:", createTask);
        } catch (error) {
            console.error("Failed to add task:", error);    
        } finally {
            setLoading(false);
        }
    }


return (
    <div className="mt-2">
        {showForm ? (
            <form onSubmit={handleSubmit}>
                <input value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder=" Task title"
                  className="w-full p-2 rounded bg-[#1f1f1f] border border-white/20 text-sm text-white"
                 />
                 <button
                 disabled={loading || !title.trim()}
                 type="submit"
                 className="bg-green-600 hover:bg-green-700 px-3 rounded text-white"
                 >
                    {loading ? "Adding..." : "Add Task"}
                 </button>
                 <button
            type="button"
            onClick={() => setShowForm(false)}
            className="text-gray-400 hover:text-red-500"
          >
            Cancel
          </button>
            </form>
        ):(
            <button
                onClick={() => setShowForm(true)}
                className="text-sm text-blue-400 hover:text-blue-600 hover:underline mt-2"
            >
                +Add Task
            </button>
        )}
    </div>
)}

export default AddTaskButton;