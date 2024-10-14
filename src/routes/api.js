const express = require("express");
const routerAPI = express.Router();
const jwt = require("jsonwebtoken");
const Users = require("../model/users");
const bcrypt = require("bcryptjs");
require("dotenv").config(); // Ensure this is at the top of your file

const {
  getReadUserFB,
  postUpdateUserFB,

  postAddFriends,
  putAddFriends,
  getListFriendSAdd,
  getListFriendUser,
  postLogin,
  putProfileUser,
} = require("./../controllers/userCustommer");
const {
  postMessages,
  getMessagesAPI,
  getSeenMessagesAPI,
  putMessageAPI,
  getAllMessAPI,
} = require("./../controllers/messageCustomer");

const {
  refreshAccessToken,
  sendResetEmail,
} = require("./../services/CRUDUser");
const authenticateJWT = require("./../middleware/authenticateJWT");

const {
  createNewPostUser,
  getNewPostUsers,
  postLikeUser,
  getLikesForPost,
} = require("./../controllers/Post");

const {
  getCommentsAPI,
  CreateCommentsAPI,
  postLikeComment,
  getLikesForComment,
  getUniqueCommentersWithNamesAPI,
} = require("./../controllers/comment");
const {
  getNotifications,
  getCountNotifications,
} = require("../controllers/notifications");
const Messages = require("../model/message");

// crud users
routerAPI.get("/users", getReadUserFB);
routerAPI.post("/users", postUpdateUserFB);
routerAPI.put("/users/:id", putProfileUser);

// tính năng thêm bạn bè
routerAPI.post("/addfriend", postAddFriends);
routerAPI.put("/addfriend/:userId/:friendId", putAddFriends);
routerAPI.get("/addfriend/:id", getListFriendSAdd);

// accepted
routerAPI.get("/users/:id", getListFriendUser);

// xem tin nhắn
routerAPI.get("/message/:senderId/:receiverId", getMessagesAPI);
routerAPI.get("/allmessage/:currentUserId", async (req, res) => {
  try {
    let { currentUserId } = req.params;

    const messages = await Messages.find({
      $or: [{ senderId: currentUserId }, { receiverId: currentUserId }],
    })
      .populate("senderId", "profile.avatar profile.name")
      .populate("receiverId", "profile.avatar profile.name")
      .exec();

    return res.status(200).json({
      EC: 0, // Success
      data: messages, // Trả về danh sách tin nhắn
    });
  } catch (error) {
    console.error("Error retrieving messages:", error);
    return res.status(500).json({
      EC: -1, // Error code
      message: "Failed to retrieve messages", // Thông báo lỗi
    });
  }
});
// gưi tin nhắn
routerAPI.post("/message", postMessages);
// count seen
routerAPI.get("/message/:receiverId", getSeenMessagesAPI);

routerAPI.put("/message/:senderId/:receiverId", putMessageAPI);

// login
routerAPI.post("/login", postLogin);
routerAPI.post("/logout/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Update user status to offline
    await Users.findByIdAndUpdate(userId, {
      isOnline: false,
      lastActive: new Date(), // Optional: Update last active time
    });

    // Clear any session data if needed
    // For example, you might want to invalidate JWT tokens if you're using them.

    res.status(200).json({ success: true, message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ success: false, message: "Logout failed" });
  }
});
routerAPI.get("/protected", authenticateJWT, (req, res) => {
  res.send("This is a protected route");
});
// token
routerAPI.post("/refresh-token", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Không có refresh token" });
  }

  // Giả sử bạn lưu refreshToken trong database
  const tokenInDb = await TokenModel.findOne({ token: refreshToken });

  if (!tokenInDb) {
    return res
      .status(403)
      .json({ message: "Refresh token không hợp lệ hoặc đã bị thu hồi" });
  }

  // Xóa refreshToken khỏi database (hoặc đánh dấu là hết hạn nếu muốn)
  await TokenModel.findOneAndDelete({ token: refreshToken });

  return res
    .status(200)
    .json({ success: true, message: "Refresh token đã bị hủy" });
});

// like
routerAPI.post("/like", postLikeUser);
routerAPI.get("/like/:postIds", getLikesForPost);
routerAPI.post("/post", createNewPostUser);
routerAPI.get("/post", getNewPostUsers);

// comment
routerAPI.get("/comment", getCommentsAPI);
routerAPI.post("/comment", CreateCommentsAPI);
//like comment
routerAPI.get("/likeComment/:postIds", getLikesForComment);
routerAPI.post("/likecomment", postLikeComment);

// count tổng sô bình luận trên bài viết
routerAPI.get("/comentCount", getUniqueCommentersWithNamesAPI);

// senmail

routerAPI.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    await sendResetEmail(email);
    res
      .status(200)
      .json({ message: "Vui lòng kiểm tra email để đặt lại mật khẩu" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
routerAPI.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    // Giải mã token
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET_KEY);
    const userId = decoded.userId;

    // Tìm người dùng theo userId
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "Người dùng không tồn tại" });
    }

    // Mã hóa mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Mật khẩu đã được đặt lại thành công" });
  } catch (error) {
    // Log the error for debugging
    console.error("Error during password reset:", error);

    // Distinguish between token expiration and invalid signature
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(400).json({ message: "Token đã hết hạn" });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({ message: "Token không hợp lệ" });
    }

    res.status(400).json({ message: "Lỗi không xác định" });
  }
});
routerAPI.get("/messFace/:currentUserId", async (req, res) => {});
routerAPI.get("/nocatifition/:userId", getNotifications);
routerAPI.get("/nocatifitionCount/:userId", getCountNotifications);
module.exports = routerAPI;
