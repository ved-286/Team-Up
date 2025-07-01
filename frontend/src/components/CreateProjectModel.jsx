// src/components/ProjectModal.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createProject } from "../services/ProjectService"
import { useAuth } from "../contexts/authContext";
import { getAllUsers } from "../services/authService";

const CreateProjectModel = ({ isOpen, onClose, onSuccess }) => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", collaborators: [] });

  useEffect(() => {
    if (isOpen) {
      getAllUsers(token).then(setUsers);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createProject(form, token);
    onSuccess();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-xl bg-white/10 backdrop-blur-lg p-8 rounded-xl shadow-xl border border-white/20 text-white"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
          >
            <h2 className="text-2xl font-bold mb-4">Create New Project</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Project Title"
                className="w-full bg-black/20 rounded px-4 py-2"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <textarea
                placeholder="Project Description"
                className="w-full bg-black/20 rounded px-4 py-2"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <span>Add Collaborater</span>
              <select
                multiple
                className="w-full bg-black/20 rounded px-4 py-2"
                value={form.collaborators}
                onChange={(e) =>
                  setForm({
                    ...form,
                    collaborators: Array.from(e.target.selectedOptions).map((o) => o.value),
                  })
                }
              >
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.username} ({user.email})
                  </option>
                ))}
              </select>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-500 text-black font-bold rounded"
                >
                  Create Project
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateProjectModel;
