const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
        friendId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
        status: String,
        addedAt: Date,
      },
    ],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  },
  { timestamps: true }
);

// Middleware hash mật khẩu trước khi lưu
UsersSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
const Users = mongoose.model("Users", UsersSchema);

module.exports = Users;
