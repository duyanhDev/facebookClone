const express = require("express");
const routerAPI = express.Router();
const {
  getReadUserFB,
  postUpdateUserFB,
  postAddFriends,
  putAddFriends,
  getListFriendSAdd,
} = require("./../controllers/userCustommer");

routerAPI.get("/users", getReadUserFB);
routerAPI.post("/users", postUpdateUserFB);
routerAPI.post("/addfriend", postAddFriends);
routerAPI.put("/addfriend", putAddFriends);
routerAPI.get("/addfriend/:id", getListFriendSAdd);
module.exports = routerAPI;
