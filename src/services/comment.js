const Comments = require("./../model/comment");
const Users = require("./../model/users");
const mongoose = require("mongoose");
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
    console.log("Post with Author:", CommentWithAuthor);
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
    throw error; // Re-throw the error to be handled by the calling function or middleware
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
              reaction: reaction, // Thêm reaction
              userName: userName, // Thêm tên người dùng
            },
          },
        },
        { new: true } // Trả về tài liệu đã cập nhật
      );
    }

    return res;
  } catch (error) {
    console.error(error);
    throw new Error("Error toggling like: " + error.message);
  }
};
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
module.exports = {
  getComments,
  CreateComments,
  postCommentLike,
  getUniqueCommentersWithNames,
};
