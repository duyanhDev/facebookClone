const Comments = require("./../model/comment");
const Users = require("./../model/users");
const mongoose = require("mongoose");
const { CreateCommentsNotification } = require("./notification");

const getComments = async () => {
  try {
    const result = await Comments.find({})
      .sort({ createdAt: -1 })
      .populate({
        path: "likes.userId", // Path to the field to populate
        select: "profile.name", // Select the name field in the profile subdocument
      })
      .exec();
    return result;
  } catch (error) {
    console.log(error);
  }
};

const CreateComments = async (commentData) => {
  try {
    const newComment = await Comments.create(commentData);

    const CommentWithAuthor = await Comments.findById(newComment._id)
      .populate({
        path: "authorId",
        select: "profile.name profile.avatar",
      })
      .exec();
    if (CommentWithAuthor && CommentWithAuthor.authorId) {
      const { profile } = CommentWithAuthor.authorId;

      if (profile && profile.name && profile.avatar) {
        const updateComment = await Comments.findByIdAndUpdate(
          CommentWithAuthor._id,
          {
            authorName: profile.name,
            avatar: profile.avatar,
          },
          { new: true }
        );

        return updateComment;
      } else {
        throw new Error("Author profile is missing `name` or `avatar`.");
      }
    } else {
      throw new Error("Post with author details could not be populated.");
    }
  } catch (error) {
    console.error("Error creating new post:", error);
    throw error;
  }
};

const CreateCommentsfeedback = async (commentData, receiverId, senderId) => {
  try {
    const newComment = await Comments.create(commentData);

    const CommentWithAuthor = await Comments.findById(newComment._id)
      .populate({
        path: "authorId",
        select: "profile.name profile.avatar",
      })
      .exec();

    if (CommentWithAuthor && CommentWithAuthor.authorId) {
      const { profile } = CommentWithAuthor.authorId;

      if (profile && profile.name && profile.avatar) {
        const updatedComment = await Comments.findByIdAndUpdate(
          CommentWithAuthor._id,
          {
            authorName: profile.name,
            avatar: profile.avatar,
          },
          { new: true }
        );

        await CreateCommentsNotification(
          updatedComment.postId,
          receiverId,
          senderId, // Ensure this is not undefined
          updatedComment._id
        );

        return updatedComment;
      } else {
        throw new Error("Author profile is missing `name` or `avatar`.");
      }
    } else {
      throw new Error("Comment with author details could not be populated.");
    }
  } catch (error) {
    console.error("Error creating new comment:", error);
    throw error;
  }
};

const postCommentLike = async (_id, authorId, userId, reaction) => {
  try {
    if (!_id || !authorId || !userId || !reaction) {
      throw new Error("Invalid input parameters");
    }

    // Lấy thông tin người dùng
    const user = await Users.findById(userId).select("name"); // Chỉ chọn tên

    if (!user) {
      throw new Error("User not found");
    }

    const userName = user.name;

    // Kiểm tra nếu bài viết tồn tại và người dùng đã thích
    const post = await Comments.findOne({
      _id,
      authorId,
      "likes.userId": userId,
    });

    let res;

    if (post) {
      if (reaction === "like") {
        // Nếu reaction là 'like', gỡ bỏ like
        res = await Comments.findOneAndUpdate(
          { _id, authorId },
          {
            $pull: { likes: { userId: userId } }, // Gỡ bỏ like
          },
          { new: true } // Trả về tài liệu đã cập nhật
        );
      } else {
        // Nếu người dùng đã thích, cập nhật reaction của like hiện tại
        res = await Comments.findOneAndUpdate(
          { _id, authorId, "likes.userId": userId },
          {
            $set: {
              "likes.$.reaction": reaction, // Cập nhật reaction
            },
          },
          { new: true } // Trả về tài liệu đã cập nhật
        );
      }
    } else {
      // Nếu người dùng chưa thích bài viết, thêm like mới
      res = await Comments.findOneAndUpdate(
        { _id, authorId },
        {
          $push: {
            likes: {
              userId: userId,
              reaction: reaction,
              userName: userName,
            },
          },
        },
        { new: true }
      );
    }

    return res;
  } catch (error) {
    console.error(error);
    throw new Error("Error toggling like: " + error.message);
  }
};

// like cái phản hổi
const postLikeRecomment = async (_id, authorId, userId, reaction, replyId) => {
  try {
    if (!_id || !authorId || !userId || !reaction || !replyId) {
      throw new Error("Invalid input parameters");
    }

    // Get user information
    const user = await Users.findById(userId).select("name");
    if (!user) {
      throw new Error("User not found");
    }
    const userName = user.name;

    // Find the comment
    const comment = await Comments.findOne({ _id, authorId });
    if (!comment) {
      throw new Error("Comment not found");
    }

    // Find the specific reply
    const replyIndex = comment.replies.findIndex(
      (reply) => reply._id.toString() === replyId
    );
    if (replyIndex === -1) {
      throw new Error("Reply not found");
    }

    // Check if the user has already liked this reply
    const existingLikeIndex = comment.replies[replyIndex].likes.findIndex(
      (like) => like.userId.toString() === userId
    );

    let updateOperation;

    if (existingLikeIndex !== -1) {
      // User has already liked this reply
      if (reaction === "like") {
        // Remove the like
        updateOperation = {
          $pull: { [`replies.${replyIndex}.likes`]: { userId: userId } },
        };
      } else {
        // Update the existing reaction
        updateOperation = {
          $set: {
            [`replies.${replyIndex}.likes.${existingLikeIndex}.reaction`]:
              reaction,
          },
        };
      }
    } else {
      // User hasn't liked this reply yet, add a new like
      updateOperation = {
        $push: {
          [`replies.${replyIndex}.likes`]: {
            userId: userId,
            reaction: reaction,
            userName: userName,
          },
        },
      };
    }

    // Apply the update
    const res = await Comments.findOneAndUpdate(
      { _id, authorId },
      updateOperation,
      { new: true }
    );

    return res;
  } catch (error) {
    console.error(error);
    throw new Error("Error toggling like on reply: " + error.message);
  }
};
//  lấy bình luận
const getUniqueCommentersWithNames = async (postId) => {
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new Error(`Invalid postId: ${postId}`);
  }

  const uniqueCommenters = await Comments.aggregate([
    {
      $match: { postId: new mongoose.Types.ObjectId(postId) },
    },
    {
      $group: {
        _id: "$authorId",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $unwind: {
        path: "$userDetails",
        preserveNullAndEmptyArrays: true, // Giữ lại bình luận nếu không có thông tin người dùng
      },
    },
    {
      $project: {
        _id: 0,
        name: "$userDetails.profile.name",
      },
    },
  ]);

  return {
    totalUniqueCommenters: uniqueCommenters.length,
    commenters: uniqueCommenters,
    postId: postId,
  };
};

const postRelyComment = async (req, res) => {
  const {
    commentId,
    authorId,
    postId,
    authorName,
    content,
    avatar,
    image,
    receiverId,
    senderId,
  } = req.body;
  console.log(commentId, authorId, authorName, content);

  try {
    const comment = await Comments.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    // Tạo đối tượng phản hồi
    const newReply = {
      content: content,
      authorId: authorId,
      postId: postId,
      authorName: authorName,
      content: content,
      avatar: avatar,
      image: image, // Có thể để trống nếu không có
    };

    // Thêm phản hồi vào mảng replies
    comment.replies.push(newReply);
    await comment.save(); // Lưu lại bình luận
    await CreateCommentsNotification(
      newReply.postId,
      receiverId,
      senderId, // Ensure this is not undefined
      commentId
    );

    res.status(200).json({ message: "Reply added successfully.", comment });
  } catch (error) {
    console.error("Error in reply API:", error);
    res.status(500).json({ message: "Error adding reply.", error });
  }
};
module.exports = {
  getComments,
  CreateComments,
  postCommentLike,
  getUniqueCommentersWithNames,
  CreateCommentsfeedback,
  postRelyComment,
  postLikeRecomment,
};
