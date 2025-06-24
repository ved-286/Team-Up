import React from 'react'
import { useAuth } from '../contexts/authContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {

  const { logout } = useAuth();
  const navigate = useNavigate();

   const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };
  return (
    <div>
      <button onClick={handleLogout}>logout</button>
    </div>
  )
}

export default Home