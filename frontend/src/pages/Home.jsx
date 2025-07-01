// File: src/pages/Home.jsx

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import React from "react";

const Home = () => {
  return (
    <div className="min-h-screen bg-black text-white font-sans relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20 z-0"></div>

      {/* Navbar */}
      <nav className="z-10 relative flex justify-between items-center px-10 py-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl font-bold tracking-widest text-yellow-400"
        >
          Provity
        </motion.div>

        <motion.ul 
          className="flex space-x-8 text-gray-300 font-medium"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <li className="hover:text-white transition-colors duration-200 cursor-pointer">Just</li>
          <li className="hover:text-white transition-colors duration-200 cursor-pointer">Do</li>
          <li className="hover:text-white transition-colors duration-200 cursor-pointer">It</li>
        </motion.ul>

        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="ml-4"
        >
          <Link to="/login">
            <button className="bg-yellow-400 text-black px-4 py-2 rounded-md font-semibold shadow hover:shadow-lg transition duration-300">
              Get Started
            </button>
          </Link>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <main className="z-10 relative flex flex-col justify-center items-center text-center py-24 px-6">
        <motion.span 
          className="text-sm uppercase tracking-widest text-gray-400 mb-4"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.2 }}
        >
          Project Management Redefined
        </motion.span>

        <motion.h1
          className="text-5xl md:text-6xl font-extrabold max-w-4xl leading-tight"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Manage Your Work <span className="text-yellow-400">Visually</span>
        </motion.h1>

        <motion.p 
          className="mt-6 text-lg text-gray-300 max-w-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Collaborate in real-time, organize tasks in Kanban view, and elevate your team's productivity with Provity.
        </motion.p>

        <motion.div 
          className="mt-10 flex gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link to="/login">
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-md transition duration-300">
              Login
            </button>
          </Link>
          <Link to="/register">
            <button className="border border-yellow-400 hover:bg-yellow-500 hover:text-black text-yellow-400 font-semibold px-6 py-3 rounded-md transition duration-300">
              Register
            </button>
          </Link>
        </motion.div>
      </main>
    </div>
  );
};

export default Home;
