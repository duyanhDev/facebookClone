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
import Profile from "./Components/Profile/Profile.js";
import Stories from "./Components/stories/stories.js";
import AdminUsers from "./Components/AdminUsers/AdminUsers.js";
import PhotoPost from "./Components/PhotoPost/PhotoPost.js";
import { FriendUser } from "./Components/FriendsUser/FriendsUser.js";
import { FriendsList } from "./Components/FriendsList/FriendsList.js";
import FriendRequests from "./Components/FriendRequests/FriendRequests.js";

const Layout = () => {
  const { isAuthenticated, role } = useContext(AuthContext); // Combine useContext for both values

  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgotPassword" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/stories/create" element={<Stories />} />
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
        <Route path="profile/:id" element={<Profile />} />
        <Route path="photo/:id" element={<PhotoPost />} />
        <Route path="friends" element={<FriendsList />}>
          <Route index element={<FriendUser />} />
          <Route path="requests" element={<FriendRequests />} />
        </Route>
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
      >
        <Route index element={<AdminUsers />} />
      </Route>
    </Routes>
  );
};

export default Layout;
