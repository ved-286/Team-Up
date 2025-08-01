import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/authContext.jsx'
import { NotificationProvider } from './contexts/notificationContext.jsx'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NotificationProvider>
<AuthProvider >
    <App />
    <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
  </AuthProvider>
  </NotificationProvider>
  </StrictMode>,
)
