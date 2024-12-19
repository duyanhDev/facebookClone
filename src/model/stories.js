const mongoose = require("mongoose");
const { Schema } = mongoose;

const StorySchema = new Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users", // Tham chiếu đến bảng Users
      required: true,
    },
    // authorName: { type: String, required: true },
    // avatar: { type: String }, // Ảnh đại diện của tác giả
    content: { type: String }, // Nội dung văn bản
    images: { type: String }, // Danh sách các đường dẫn ảnh
    video: { type: String }, // Đường dẫn video (nếu có)
    visibility: {
      type: String,
      enum: ["public", "friends", "private"], // Trạng thái hiển thị
      default: "public",
    },
    reactions: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
        reaction: {
          type: String,
          enum: [
            "like",
            "love",
            "thương thương",
            "haha",
            "wow",
            "sad",
            "angry",
          ],
          default: "like",
        },
      },
    ],
    viewers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }], // Danh sách người đã xem story
    expiresAt: {
      type: Date,
      default: () => Date.now() + 24 * 60 * 60 * 1000, // Story mặc định hết hạn sau 24h
    },
  },
  { timestamps: true }
);

const Story = mongoose.model("Story", StorySchema);
module.exports = Story;
