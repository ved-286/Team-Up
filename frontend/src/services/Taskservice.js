import axios from './api'

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const createTask = async (taskData) => {
    try {
        const res = await axios.post("/api/tasks/create", taskData, getAuthHeaders());
        return res.data;
    } catch (error) {
        console.error("Error creating task:", error);
        throw error;
    }
    }

    export const getTaskById = async (taskId) => {
    try {
        const res = await axios.get(`/api/tasks/${taskId}`, getAuthHeaders());
        return res.data;
    } catch (error) {
        console.error("Error fetching task by ID:", error);
        throw error;
    }
  }

  export const updateTask = async (taskId, taskData) => {
    try {
        const res = await axios.put(`/api/tasks/update/${taskId}`, taskData, getAuthHeaders());
        return res.data;
    } catch (error) {
        console.error("Error updating task:", error);
        throw error;
    }
  }

  export const deleteTask = async (taskId) => {
    try {
        const res = await axios.delete(`/api/tasks/delete/${taskId}`, getAuthHeaders());
        return res.data;
    } catch (error) {
        console.error("Error deleting task:", error);
        throw error;
    }
  }