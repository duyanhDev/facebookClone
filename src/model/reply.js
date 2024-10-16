const mongoose = require("mongoose");
const { Schema } = mongoose;

const ReplySchema = new Schema(
  {
    content: { type: String, required: true },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    authorName: { type: String, required: true },
    avatar: { type: String },
    image: { type: String },
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
  },

  { timestamps: true }
);

module.exports = ReplySchema;
