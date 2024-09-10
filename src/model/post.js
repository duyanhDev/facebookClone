const mongoose = require("mongoose");
const { Schema } = mongoose;

const PostSchema = new Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    content: { type: String, required: true },
    image: { type: String }, // Nếu bài viết có hình ảnh
    // Lưu thông tin người dùng đã "like" bài viết ở đây
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comments" }],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
