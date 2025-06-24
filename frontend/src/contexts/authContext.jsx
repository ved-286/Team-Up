import { createContext , use, useContext, useEffect , useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
   const [user, setUser] = useState(()=>{
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
   });
    
   const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
   });

   const login = ({ token, user }) => {
     
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
       setToken(token);
      setUser(user);
   };

   const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
   }

   return (
      <AuthContext.Provider value={{ user, token, login, logout }}>
         {children}
      </AuthContext.Provider>
    );
    
  
    }

    export const useAuth = () => useContext(AuthContext);