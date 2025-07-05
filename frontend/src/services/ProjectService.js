import axios from './api'; // assuming it's an axios instance

// Utility to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const fetchProjects = async () => {
  try {
    const res = await axios.get("/api/projects", getAuthHeaders());
    return res.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

export const createProject = async (projectData) => {
  try {
    const res = await axios.post("/api/projects/create", projectData, getAuthHeaders());
    return res.data;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const getProjectById = async (projectId) => {
  try {
    const res = await axios.get(`/api/projects/${projectId}`, getAuthHeaders());
    return res.data;
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    throw error;
  }
}

export const getTasksByProjectId = async (projectId) => {
  try {
    const res = await axios.get(`/api/tasks/${projectId}/tasks`, getAuthHeaders());
    return res.data;
  } catch (error) {
    console.error("Error fetching tasks by project ID:", error);
    throw error;
  }
}