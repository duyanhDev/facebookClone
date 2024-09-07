require("dotenv").config();
const jwt = require("jsonwebtoken");

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Lấy token từ header "Authorization"
  console.log("Auth Header:", authHeader);
  if (!token) {
    return res
      .status(401)
      .json({ message: "Không có token, truy cập bị từ chối" });
  }

  try {
    // In giá trị secret key để kiểm tra

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Sử dụng secret key từ biến môi trường
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification error:", err); // Ghi log lỗi
    return res.status(401).json({ message: "Token không hợp lệ" });
  }
};

module.exports = authenticateJWT;
