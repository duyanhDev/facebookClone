const mongoose = require("mongoose");
const { Schema } = mongoose;

const PostSchema = new Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    authorName: { type: String },
    avatar: { type: String }, // Add this field to store the author's name
    content: { type: String, required: true },
    image: { type: String },
    video: { type: String },
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
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comments" }],
    taggedFriends: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
