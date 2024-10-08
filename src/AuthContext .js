import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("token"))
  );
  const [role, setRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const roleToken = localStorage.getItem("role");
    setIsAuthenticated(Boolean(token));
    setRole(roleToken ? roleToken.toLowerCase() : ""); // Convert role to lowercase
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, role, setRole }}
    >
      {children}
    </AuthContext.Provider>
  );
};
