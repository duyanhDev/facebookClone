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
      enum: ["friend_request", "like", "comment"],
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: function () {
        return this.type === "Thích" || this.type === "comment";
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

// Tạo index cho các trường receiverId và seen để tối ưu hóa tìm kiếm thông báo chưa đọc
NotificationSchema.index({ receiverId: 1, seen: 1 });

const Notification = mongoose.model("Notification", NotificationSchema);
module.exports = Notification;
