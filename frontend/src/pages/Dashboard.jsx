// File: src/pages/Dashboard.jsx
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-[#0D1117] text-white overflow-hidden">
      {/* Fixed sidebar */}
      <div className="w-64 fixed top-0 left-0 h-full bg-[#161B22] border-r border-gray-700 z-50">
        <Sidebar />
      </div>

      {/* Main content with left margin equal to sidebar width */}
      <div className="flex-1 ml-64 overflow-y-auto p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
