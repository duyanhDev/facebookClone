const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UsersSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    profile: {
      name: String,
      gender: {
        type: String,
        enum: ["male", "female", "other"], // Đảm bảo "male" nằm trong danh sách này
        default: "male",
      },
      birthday: Date,
      bio: String,
      avatar: String,
      coverPhoto: String,
      currentCity: String, // Nơi ở hiện tại
      hometown: String, // Quê quán/Nơi sinh ra,
      introduce: String,
      relationshipStatus: {
        // Tình trạng quan hệ
        type: String,
        enum: [
          "Single",
          "In a relationship",
          "Engaged",
          "Married",
          "Complicated",
          "Divorced",
          "Widowed",
        ],
        default: "Single",
      },
      education: [
        {
          school: String,
          degree: String, //Bằng cấp mà người dùng đã đạt được từ trường học.
          fieldOfStudy: String, // Ngành học hoặc lĩnh vực nghiên cứu mà người dùng theo học
          startDate: Date, //Ngày bắt đầu khóa học hoặc chương trình giáo dục.
          endDate: Date, // kết thúc khóa học hoặc chương trình giáo dục.
          current: { type: Boolean, default: false },
        },
      ],
      work: [
        {
          company: String,
          position: String,
          startDate: Date,
          endDate: Date,
          current: { type: Boolean, default: false },
        },
      ],
      phoneNumber: String,
      languages: [String], // Danh sách ngôn ngữ
      websites: [String], // Danh sách website cá nhân
    },
    friends: [
      {
        friendId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
        status: String,
        addedAt: Date,
      },
    ],
    followers: [
      {
        followerId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
        followedAt: { type: Date, default: Date.now },
      },
    ], // Người theo dõi
    following: [
      {
        followingId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
        followedAt: { type: Date, default: Date.now },
      },
    ],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    lastActive: { type: Date, default: Date.now },
    isOnline: { type: Boolean, default: false },
    privacySettings: {
      // Cài đặt quyền riêng tư
      profileVisibility: {
        type: String,
        enum: ["public", "friends", "only me"],
        default: "public",
      },
      postsVisibility: {
        type: String,
        enum: ["public", "friends", "only me"],
        default: "public",
      },
    },
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }], // Danh sách người bị chặn
  },
  { timestamps: true }
);

const Users = mongoose.model("Users", UsersSchema);

module.exports = Users;
