import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem("authToken", "myAuthToken");
    } else {
      localStorage.removeItem("authToken");
    }
  }, [isLoggedIn]);

  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  const value = {
    isLoggedIn,
    toggleLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;