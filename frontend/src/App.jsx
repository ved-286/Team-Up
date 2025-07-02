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

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard routes with nested children */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          {/* Index route - default page when visiting /dashboard */}
          <Route index element={<Chat />} />

          {/* Nested routes */}
          <Route path="chat" element={<Chat />} />
          <Route path="projects" element={<Project />} />
          <Route path="projects/:projectId" element={<ProjectDetailes />} />
          <Route path="settings" element={<Settings />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>

        {/* Wildcard */}
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
