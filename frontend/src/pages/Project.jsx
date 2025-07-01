// src/pages/Projects/ProjectsPage.jsx
import React, { useEffect, useState } from 'react';
import { fetchProjects } from '../services/ProjectService';
import ProjectCard from '../components/ProjectCard';
import CreateProjectModel from '../components/CreateProjectModel';

const Project = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await fetchProjects();
      setProjects(Array.isArray(data) ? data : data.projects || []);
    } catch (err) {
      console.error('Failed to load projects', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <div className="p-6 relative">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl text-white font-bold">Your Projects</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + New Project
        </button>
      </div>

      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-3 text-center text-gray-500">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="col-span-3 text-center text-gray-500">No projects found. Create a new one!</div>
        ) : (
          projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))
        )}
      </div>

      {showModal && (
        <CreateProjectModel
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={loadProjects}
        />
      )}
    </div>
  );
};

export default Project;
