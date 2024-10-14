require("dotenv").config();
const jwt = require("jsonwebtoken");
const Users = require("../model/users");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
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
    // Find the user by email
    const user = await Users.findOne({ email });
    if (!user) {
      return { success: false, message: "Người dùng không tồn tại" }; // User does not exist
    }

    // Compare provided password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(password, user.password); // For debugging purposes; remove in production

    if (!isMatch) {
      return { success: false, message: "Sai mật khẩu" }; // Invalid password
    }

    // Generate JWT tokens
    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: "1h" }); // Access token
    const refreshToken = jwt.sign({ id: user._id }, refreshSecret, {
      expiresIn: "7d",
    }); // Refresh token

    user.lastActive = new Date();
    user.isOnline = true;
    await user.save();

    return {
      success: true,
      token,
      refreshToken,

      user: {
        name: user.profile.name,
        avatar: user.profile.avatar,
        id: user._id,
        role: user.role,
        isOnline: user.isOnline,
      },
    };
  } catch (error) {
    console.error("Error during login:", error);
    return { success: false, message: "Có lỗi xảy ra. Vui lòng thử lại." }; // Generic error message
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

// send maill

const sendResetEmail = async (email) => {
  try {
    // Tìm người dùng theo email
    const user = await Users.findOne({ email });
    if (!user) {
      throw new Error("Email không tồn tại trong hệ thống");
    }

    // Tạo token đặt lại mật khẩu
    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_SECRET_KEY,
      {
        // Ensure you use the correct environment variable
        expiresIn: "1h",
      }
    );

    // Tạo link để đặt lại mật khẩu
    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    // Cấu hình transporter cho Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Thông tin email
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: user.email,
      subject: "Đặt lại mật khẩu",
      text: `Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng click vào link sau để đặt lại mật khẩu: ${resetLink}`,
    };

    // Gửi email
    await transporter.sendMail(mailOptions);
    console.log(`Email đã được gửi đến: ${user.email}`);
  } catch (error) {
    // Ghi log chi tiết lỗi
    console.error("Lỗi khi gửi email:", error.message);
    if (error.response) {
      console.error("Chi tiết lỗi từ Gmail:", error.response);
    }
  }
};

module.exports = {
  getReadUser,
  postCreateUser,
  postLoginJWT,
  refreshAccessToken,
  putUserAPI,
  sendResetEmail,
};
