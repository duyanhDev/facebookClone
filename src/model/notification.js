const mongoose = require("mongoose");
const { Schema } = mongoose;

const NotificationSchema = new Schema(
  {
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    type: {
      type: String,
      enum: ["friend_request", "like", "comment", "new_post"], // Add new_post here
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: function () {
        return (
          this.type === "like" ||
          this.type === "comment" ||
          this.type === "new_post"
        ); // Update the condition
      },
    },
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comments",
      required: function () {
        return this.type === "comment";
      },
    },
    seen: { type: Boolean, default: false },
  },
  { timestamps: true }
);

NotificationSchema.index({ receiverId: 1, seen: 1 });

const Notification = mongoose.model("Notification", NotificationSchema);
module.exports = Notification;
