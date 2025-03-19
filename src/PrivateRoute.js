import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ element, isAuthenticated, role }) => {
  const location = useLocation(); // Lấy thông tin đường dẫn hiện tại
  console.log("Current path:", location.pathname);
  console.log("IsAuthenticated:", isAuthenticated, "Role:", role);

  // Nếu chưa xác thực, chuyển hướng về login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Nếu truy cập /admin, chỉ cho phép role admin
  if (location.pathname === "/admin") {
    if (role === "admin") {
      return element;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  // Cho phép truy cập các route khác nếu đã xác thực
  return element;
};

export default PrivateRoute;
