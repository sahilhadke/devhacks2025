import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
  // profile pic
    const [user, setUser] = useState(null);

    useEffect(() => {
      const storedUser = localStorage.getItem("user");
      if (storedUser === "undefined") {
        setUser(null);
      }
      if (storedUser === "null") {
        setUser(null);
      }
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }, []);

  useEffect(() => {
    localStorage.setItem("isAuthenticated", isAuthenticated);
    localStorage.setItem("user", JSON.stringify(user));
    console.log("User data saved to localStorage:", user);
  }, [isAuthenticated, user]);

  const login = (user) => {
    console.log("User data:", user);
    setIsAuthenticated(true);
    setUser(localStorage.setItem("user", JSON.stringify(user)));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

