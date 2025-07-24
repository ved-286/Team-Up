import axios from './api'

const API = '/api/chats';
const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  export const getAllChats = async () => {
    try {
        const response = await axios.get('/api/chats', getAuthHeaders())
        return response.data
    } catch (error) {
        console.error('Error fetching chats:', error)
        throw error
    }
  }

  export const getChatById = async (chatId) => {
    try {
        const response = await axios.get(`${API}/${chatId}`, getAuthHeaders())
        return response.data
    } catch (error) {
        console.error('Error fetching chat:', error)
        throw error
    }
  }
  export const createChat = async (chatData) => {
    try {
        const response = await axios.post(API, chatData, getAuthHeaders())
        return response.data
    } catch (error) {
        console.error('Error creating chat:', error)
        throw error
    }
  }
  export const sendMessage = async (chatId, messageData) => {
    try {
        // Ensure chatId is included in the body as required by backend
        const payload = { ...messageData, chatId };
        const response = await axios.post(`${API}/${chatId}/messages`, payload, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
  }
  export const getMessagesByChatId = async (chatId) => {
    try {
        const response = await axios.get(`${API}/${chatId}/messages`, getAuthHeaders())
        return response.data
    } catch (error) {
        console.error('Error fetching messages:', error)
        throw error
    }
  }
  export const deleteChat = async (chatId) => {
    try {
        const response = await axios.delete(`${API}/${chatId}`, getAuthHeaders())
        return response.data
    } catch (error) {
        console.error('Error deleting chat:', error)
        throw error
    }
  }