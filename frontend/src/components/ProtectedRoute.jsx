import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";


export default function ProtectedRoute ({children, allowedRoles}) {
      const { token } = useAuth();
       
        return token ? children : <Navigate to="/login" replace />;

}