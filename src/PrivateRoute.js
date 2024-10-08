import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element, isAuthenticated, role }) => {
  console.log("Current role in PrivateRoute:", role);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Kiểm tra nếu đang truy cập vào route /admin
  if (window.location.pathname === "/admin") {
    // Chỉ cho phép admin truy cập
    if (role === "admin") {
      return element;
    } else {
      // Chuyển hướng người dùng không phải admin về trang chính
      return <Navigate to="/" replace />;
    }
  }

  // Cho các route khác, cho phép truy cập nếu đã xác thực
  return element;
};

export default PrivateRoute;
