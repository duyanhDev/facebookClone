const express = require("express");
const routerAPI = express.Router();
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
} = require("./../controllers/messageCustomer");

const { refreshAccessToken } = require("./../services/CRUDUser");
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
} = require("./../controllers/comment");

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

// gưi tin nhắn
routerAPI.post("/message", postMessages);
// count seen
routerAPI.get("/message/:receiverId", getSeenMessagesAPI);

routerAPI.put("/message/:senderId/:receiverId", putMessageAPI);

// login
routerAPI.post("/login", postLogin);
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

module.exports = routerAPI;
