import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import App from "./App";
import SliderLeft from "./Components/Content/SiderLeft";
import Main from "./../src/Components/Main/Main.js";
import Login from "./Components/Login/Login";
import PrivateRoute from "./PrivateRoute.js";
import { AuthContext } from "./AuthContext .js";
import Regsiter from "./Components/Regsiter/Regsiter.js";

const Layout = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/register" element={<Regsiter />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute element={<App />} isAuthenticated={isAuthenticated} />
        }
      >
        <Route index element={<Main />} />
        <Route path="watch" element={<SliderLeft />} />
      </Route>
    </Routes>
  );
};

export default Layout;
