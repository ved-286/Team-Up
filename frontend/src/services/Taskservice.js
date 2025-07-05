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