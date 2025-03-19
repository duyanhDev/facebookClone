const jwt = require("jsonwebtoken");

// Middleware xác thực token
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Không có token, truy cập bị từ chối" });
  }

  try {
    const decoded = jwt.verify(token, "SECRET_KEY");
    req.user = decoded; // Lưu thông tin user vào request
    next();
  } catch (error) {
    res.status(403).json({ message: "Token không hợp lệ" });
  }
};

module.exports = authMiddleware;
