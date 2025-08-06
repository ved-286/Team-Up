import axios from "./api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const API = "/api/users";

export const getProfile = async () => {
  const res = await axios.get(`${API}/me`, getAuthHeaders());
  return res.data; // returns { success, user } as in your backend
};

export const updateProfile = async (data) => {
  const res = await axios.put(`${API}/update-profile`, data, getAuthHeaders());
  return res.data; // returns { success, user }
};

export const changePassword = async (data) => {
  const res = await axios.put(`${API}/change-password`, data, getAuthHeaders());
  return res.data; // returns { success }
};
