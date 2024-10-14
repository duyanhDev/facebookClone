const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const UsersSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin"], // Phân quyền, có thể là "user" hoặc "admin"
      default: "user", // Mặc định là "user"
    },
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
    lastActive: { type: Date, default: Date.now }, // Tracks the last activity of the user
    isOnline: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Middleware hash mật khẩu trước khi lưu
// UsersSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// // Mật khẩu gốc và mật khẩu đã băm để so sánh
// const plainPassword = "1234";
// const hashedPassword =
//   "$2a$10$fViwSOD3y0RNx.kN1Eioh.gZ3fZmH./iL1c0YYHatCltz6W5bjgh2";

// // So sánh mật khẩu gốc với mật khẩu đã băm
// bcrypt.compare(plainPassword, hashedPassword, function (err, result) {
//   if (err) throw err;
//   console.log("gia", result); // Kết quả true nếu mật khẩu trùng khớp, false nếu không
// });

const Users = mongoose.model("Users", UsersSchema);

module.exports = Users;
