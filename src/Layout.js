import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import App from "./App";
import SliderLeft from "./Components/Content/SiderLeft";
import Main from "./Components/Main/Main.js"; // Removed the unnecessary `./../src` from the path
import Login from "./Components/Login/Login";
import PrivateRoute from "./PrivateRoute.js";
import { AuthContext } from "./AuthContext .js"; // Fixed the path (remove the space before .js)
import Register from "./Components/Regsiter/Regsiter.js"; // Corrected spelling from "Regsiter" to "Register"
import Admin from "./Components/Admin/Admin.js";
import ForgotPassword from "./Components/ForgotPassword/ForgotPassword.js";
import ResetPassword from "./Components/ResetPassword/ResetPassword.js";

const Layout = () => {
  const { isAuthenticated, role } = useContext(AuthContext); // Combine useContext for both values

  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgotPassword" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      <Route
        path="/"
        element={
          <PrivateRoute
            element={<App />}
            isAuthenticated={isAuthenticated}
            role={role}
          />
        }
      >
        <Route index element={<Main />} />
        <Route path="watch" element={<SliderLeft />} />
      </Route>

      <Route
        path="/admin"
        element={
          <PrivateRoute
            element={<Admin />}
            isAuthenticated={isAuthenticated}
            role={role}
          />
        }
      />
    </Routes>
  );
};

export default Layout;
