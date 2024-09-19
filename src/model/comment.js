const mongoose = require("mongoose");
const { Schema } = mongoose;

const CommentSchema = new Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    authorName: { type: String, required: true },
    avatar: { type: String }, // Optionally store the author's avatar here as well
    content: { type: String, required: true },
    image: { type: String }, // The actual comment text
    likes: [
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
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comments" }], // Support for nested comments
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;
