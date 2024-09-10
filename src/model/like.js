const LikeSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: function () {
        return !this.commentId; // postId bắt buộc khi không có commentId
      },
    },
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comments",
      required: function () {
        return !this.postId; // commentId bắt buộc khi không có postId
      },
    },
  },
  { timestamps: true }
);

// Tạo index cho các trường quan trọng để tăng tốc truy vấn
LikeSchema.index({ userId: 1, postId: 1 }, { unique: true });
LikeSchema.index({ userId: 1, commentId: 1 }, { unique: true });

const Like = mongoose.model("Like", LikeSchema);
module.exports = Like;
