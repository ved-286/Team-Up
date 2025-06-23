import axios from './api';

export const registerUser = async (userData) => {
    try {
        const response = await axios.post('/api/auth/register', userData);
        return response.data;
    } catch (error) {
        console.error("Error registering user:", error);
        throw error;
    }
}

export const loginUser = async (userData) => {
    try {
        const response = await axios.post('/api/auth/login', userData);
        return response.data;
    } catch (error) {
        console.error("Error logging in user:", error);
        throw error;
    }
}