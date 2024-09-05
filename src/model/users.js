const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profile: {
      name: String,
      gender: String,
      birthday: Date,
      bio: String,
      avatar: String,
      coverPhoto: String,
    },
    friends: [
      {
        friendId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" }, // Phải khớp với tên model đã đăng ký
        status: String,
        addedAt: Date,
      },
    ],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  },
  { timestamps: true }
);

const Users = mongoose.model("Users", UsersSchema);
module.exports = Users;
