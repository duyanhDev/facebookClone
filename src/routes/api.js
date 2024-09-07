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
} = require("./../controllers/userCustommer");
const {
  postMessages,
  getMessagesAPI,
  getSeenMessagesAPI,
} = require("./../controllers/messageCustomer");

const { refreshAccessToken } = require("./../services/CRUDUser");
const authenticateJWT = require("./../middleware/authenticateJWT");
// bạn bè
routerAPI.get("/users", getReadUserFB);
routerAPI.post("/users", postUpdateUserFB);
routerAPI.post("/addfriend", postAddFriends);
routerAPI.put("/addfriend", putAddFriends);
routerAPI.get("/addfriend/:id", getListFriendSAdd);
routerAPI.get("/users/:id", getListFriendUser);

// tin nhắn
routerAPI.get("/message/:senderId/:receiverId", getMessagesAPI);
routerAPI.post("/message", postMessages);
routerAPI.get("/message/:receiverId", getSeenMessagesAPI);
routerAPI.post("/refresh-token", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Không có refresh token" });
  }

  const result = await refreshAccessToken(refreshToken);

  if (!result.success) {
    return res.status(403).json({ message: result.message });
  }

  res.status(200).json({
    token: result.token,
  });
});

// login
routerAPI.post("/login", postLogin);
routerAPI.get("/protected", authenticateJWT, (req, res) => {
  res.send("This is a protected route");
});
module.exports = routerAPI;
