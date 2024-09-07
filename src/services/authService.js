require("dotenv").config();
const jwt = require("jsonwebtoken");
const Users = require("./model/users"); // Thay đổi đường dẫn tới mô hình người dùng

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.REFRESH_SECRET_KEY, {
    expiresIn: "7d",
  });
};

const refreshAccessToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY); // Sử dụng secret key cho refresh token
    const user = await Users.findById(decoded.id);

    if (!user) {
      return { success: false, message: "Người dùng không tồn tại" };
    }

    // Tạo access token mới
    const newToken = generateToken(user._id);

    return { success: true, token: newToken };
  } catch (error) {
    return { success: false, message: "Refresh token không hợp lệ" };
  }
};

module.exports = {
  generateToken,
  generateRefreshToken,
  refreshAccessToken,
};
