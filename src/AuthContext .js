import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("token"))
  );
  const [role, setRole] = useState(localStorage.getItem("role") || ""); // Khởi tạo từ localStorage

  // Hàm để đồng bộ trạng thái với localStorage
  const syncAuthState = () => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    setIsAuthenticated(Boolean(token));
    setRole(storedRole ? storedRole.toLowerCase() : "");
  };

  // Chạy khi mount để khởi tạo trạng thái
  useEffect(() => {
    syncAuthState();
  }, []);

  // Cung cấp hàm login/logout để cập nhật trạng thái
  const login = (token, userRole) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", userRole);
    setIsAuthenticated(true);
    setRole(userRole.toLowerCase());
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    setRole("");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        role,
        setRole,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
