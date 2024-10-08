require("dotenv").config();
const jwt = require("jsonwebtoken");
const Users = require("../model/users");
const bcrypt = require("bcryptjs");

const jwtSecret = process.env.JWT_SECRET_KEY;
const refreshSecret = process.env.REFRESH_SECRET_KEY;

const getReadUser = async () => {
  try {
    return await Users.find({});
  } catch (error) {
    console.error("Error fetching users:", error);
    return null;
  }
};

const postCreateUser = async (data) => {
  try {
    // Hash mật khẩu trước khi lưu
    const hashedPassword = await bcrypt.hash(data.password, 10);
    console.log("Mật khẩu đã băm:", hashedPassword); // In ra để kiểm tra
    data.password = hashedPassword;

    return await Users.create(data);
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
};

// cập nhật profile
const putUserAPI = async (id, username, password, role, avatar) => {
  try {
    let updateFields = {
      username: username,
      role: role,
      "profile.avatar": avatar,
    };

    // Chỉ băm mật khẩu nếu nó tồn tại và không rỗng
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
    }

    // Cập nhật thông tin người dùng
    let data = await Users.updateOne(
      { _id: id }, // Query theo _id
      {
        $set: updateFields,
      }
    );

    if (data.nModified === 0) {
      return { success: false, message: "No changes made" };
    }

    return data;
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, message: "Error updating user" };
  }
};

// Đăng nhập

const postLoginJWT = async (email, password) => {
  try {
    const user = await Users.findOne({ email });
    if (!user) {
      return { success: false, message: "Người dùng không tồn tại" };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(password, user.password);

    if (!isMatch) {
      return { success: false, message: "Sai mật khẩu" };
    }

    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: "1h" });
    const refreshToken = jwt.sign({ id: user._id }, refreshSecret, {
      expiresIn: "7d",
    });

    return {
      success: true,
      token,
      refreshToken,
      user: {
        name: user.profile.name,
        avatar: user.profile.avatar,
        id: user._id,
        role: user.role,
      },
    };
  } catch (error) {
    console.error("Error during login:", error);
    return null;
  }
};

const checkTokenExpiration = (token) => {
  try {
    const decoded = jwt.verify(token, jwtSecret); // Sử dụng secret key để xác thực
    const currentTime = Math.floor(Date.now() / 1000); // Thời gian hiện tại tính bằng giây

    if (decoded.exp < currentTime) {
      return { valid: false, message: "Token đã hết hạn" };
    }

    return { valid: true, message: "Token còn hợp lệ" };
  } catch (error) {
    return { valid: false, message: "Token không hợp lệ" };
  }
};

const refreshAccessToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, refreshSecret);
    const user = await Users.findById(decoded.id);

    if (!user) {
      return { success: false, message: "Người dùng không tồn tại" };
    }

    // Tạo access token mới
    const newToken = jwt.sign({ id: user._id }, jwtSecret, {
      expiresIn: "15m",
    });

    return { success: true, token: newToken };
  } catch (error) {
    return { success: false, message: "Refresh token không hợp lệ" };
  }
};

module.exports = {
  getReadUser,
  postCreateUser,
  postLoginJWT,
  refreshAccessToken,
  putUserAPI,
};
