// File: src/components/Sidebar.jsx

import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/authContext"; // adjust if path differs
import { LogOut, Folder, Bell, MessageCircle, Settings } from "lucide-react";
import Avatar from "./Avatar.jsx";
const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: "Projects", icon: <Folder size={20} />, to: "/dashboard/projects" },
    { name: "Chat", icon: <MessageCircle size={20} />, to: "/dashboard/chat" },
    { name: "Notifications", icon: <Bell size={20} />, to: "/dashboard/notifications" },
    { name: "Settings", icon: <Settings size={20} />, to: "/dashboard/settings" },
  ];

  return (
   <div className="bg-[#0D1117] text-[#EDEDED] border-r border-[#2D333B]
hover:bg-[#161B22] h-screen w-64 flex flex-col justify-between px-4 py-6 shadow-lg">
      {/* Top Branding */}
      <motion.div
        className="text-yellow-400 text-2xl font-extrabold mb-10 tracking-widest"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        Provity
      </motion.div>

      {/* Nav Items */}
      <nav className="flex flex-col gap-4">
        {navItems.map((item, idx) => (
          <Link key={idx} to={item.to}>
            <motion.div
              whileHover={{ scale: 1.05, backgroundColor: "#1f2937" }}
              className={`flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer transition-all duration-300 ${
                location.pathname === item.to ? "bg-gray-800" : "hover:bg-gray-800"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </motion.div>
          </Link>
        ))}
      </nav>

      {/* User Section */}
      <div className="border-t border-gray-700 pt-6 text-sm">
        <Avatar email={user.email} size={36} />
        <p className="text-gray-400">Logged in as:</p>
        <p className="font-semibold truncate">{user?.username || "User Name"}</p>
        <p className="text-gray-500 text-xs truncate">{user?.email}</p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={logout}
          className="mt-3 flex items-center gap-2 text-red-400 hover:text-red-500 transition text-sm"
        >
          <LogOut size={16} /> Logout
        </motion.button>
      </div>
    </div>
  );
};

export default Sidebar;
