// File: src/pages/Dashboard.jsx
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-[#0D1117] text-white">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        {/* This will render nested route content like Chat, Projects, etc. */}
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
