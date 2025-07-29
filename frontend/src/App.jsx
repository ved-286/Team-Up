// File: src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/chat/Chat.jsx";
import Project from "./pages/Project.jsx";
import Settings from "./pages/Settings.jsx";
import Notifications from "./pages/Notifications";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateProjectModel from "./components/CreateProjectModel.jsx";
import ProjectDetailes from "./pages/ProjectDetailes.jsx";
import { SocketContext } from "./contexts/SocketContext";
import { socket } from "./services/socket";
import { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";

const App = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const selectedChatRef = useRef(selectedChat);

  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("message-received", (msg) => {
      // Use ref to get latest selectedChat
      if (msg?.chat?._id !== selectedChatRef.current?._id) {
        setUnreadCounts((prev) => ({
          ...prev,
          [msg.chat._id]: (prev[msg.chat._id] || 0) + 1,
        }));
        toast.info(
          <>
            <b>🔵 {msg.sender?.username || msg.sender?.name || "New message"}</b>
            <div style={{ fontSize: "0.95em" }}>{msg.content}</div>
          </>,
          {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: true,
          }
        );
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []); // Only run once, on mount/unmount

  // Reset unread count when a chat is selected
  useEffect(() => {
    if (selectedChat?._id) {
      setUnreadCounts((prev) => ({ ...prev, [selectedChat._id]: 0 }));
    }
  }, [selectedChat]);

  return (
    <SocketContext.Provider value={{ socket, selectedChat, setSelectedChat }}>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Dashboard routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<Chat unreadCounts={unreadCounts} setSelectedChat={setSelectedChat} selectedChat={selectedChat} />} />
            <Route path="chat" element={<Chat unreadCounts={unreadCounts} setSelectedChat={setSelectedChat} selectedChat={selectedChat} />} />
            <Route path="projects" element={<Project />} />
            <Route path="projects/:projectId" element={<ProjectDetailes />} />
            <Route path="settings" element={<Settings />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>

          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>

      {/* Toast UI */}
      <ToastContainer />
    </SocketContext.Provider>
  );
};

export default App;
