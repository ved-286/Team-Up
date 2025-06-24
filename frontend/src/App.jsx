import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import socket from "./services/socket";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./contexts/authContext";

const App = () => {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server", socket.id);

      socket.on("disconnect", () => {
        console.log("Disconnected from server");
      });

      return () => {
        socket.disconnect(); // Clean up on unmount
      };
    });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
         <Route path="/" element={<Home />} />
        <Route path="*" element={<Home />} />
       

        {/* priveted routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

       
      </Routes>
    </BrowserRouter>
  );
};

export default App;
