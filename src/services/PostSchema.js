// src/services/PostSchema.js
const Posts = require("./../model/post");
const Users = require("./../model/users");
const { createPostNotification } = require("./../services/notification");
const GetNewPost = async () => {
  try {
    let res = await Posts.find({})
      .sort({ createdAt: -1 })
      .populate({
        path: "likes.userId",
        select: "profile.name",
      })
      .exec();

    return res;
  } catch (error) {
    console.log("error", error);
    return null;
  }
};

const CreateNewPost = async (postData) => {
  try {
    // Create the new post
    const newPost = await Posts.create(postData);

    // Populate the authorId field with the user document
    const postWithAuthor = await Posts.findById(newPost._id)
      .populate({
        path: "authorId",
        select: "profile.name profile.avatar",
      })
      .exec();

    if (postWithAuthor && postWithAuthor.authorId) {
      const { profile } = postWithAuthor.authorId;

      if (profile && profile.name && profile.avatar) {
        const updatedPost = await Posts.findByIdAndUpdate(
          postWithAuthor._id,
          {
            authorName: profile.name,
            avatar: profile.avatar,
          },
          { new: true } // Return the updated document
        );
        await createPostNotification(updatedPost._id, newPost.authorId);

        return updatedPost;
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

const postLike = async (_id, authorId, userId, reaction) => {
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
    const post = await Posts.findOne({ _id, authorId, "likes.userId": userId });

    let res;

    if (post) {
      if (reaction === "like") {
        // Nếu reaction là 'like', gỡ bỏ like
        res = await Posts.findOneAndUpdate(
          { _id, authorId },
          {
            $pull: { likes: { userId: userId } }, // Gỡ bỏ like
          },
          { new: true } // Trả về tài liệu đã cập nhật
        );
      } else {
        // Nếu người dùng đã thích, cập nhật reaction của like hiện tại
        res = await Posts.findOneAndUpdate(
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
      res = await Posts.findOneAndUpdate(
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

module.exports = {
  CreateNewPost,
  GetNewPost,
  postLike,
};
