// src/services/PostSchema.js
const Posts = require("./../model/post");
const Users = require("./../model/users");
const { createPostNotification } = require("./../services/notification");
const GetNewPost = async () => {
  try {
    let res = await Posts.find({})
      .sort({ createdAt: -1 })
      .populate({
        path: "likes.userId", // Path to the field to populate
        select: "profile.name", // Select the name field in the profile subdocument
      })
      .exec();
    // Ensure that the populated data includes necessary details for rendering icons
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
        select: "profile.name profile.avatar", // Populate with only the `name` and `avatar` fields
      })
      .exec();

    // Debugging: Log the populated post to check its content
    console.log("Post with Author:", postWithAuthor);

    if (postWithAuthor && postWithAuthor.authorId) {
      const { profile } = postWithAuthor.authorId;

      // Check if profile fields are populated correctly
      if (profile && profile.name && profile.avatar) {
        // Update the newPost with the author's name and avatar
        const updatedPost = await Posts.findByIdAndUpdate(
          postWithAuthor._id,
          {
            authorName: profile.name,
            avatar: profile.avatar,
          },
          { new: true } // Return the updated document
        );
        await createPostNotification(updatedPost._id, newPost.authorId);
        console.log("thông báo", createPostNotification);

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
// const postLike = async (_id, authorId, userId, reaction) => {
//   try {
//     // Validate inputs
//     if (!_id || !authorId || !userId || !reaction) {
//       throw new Error("Invalid input parameters");
//     }

//     // Check if the post exists and if the user has already liked it
//     const post = await Posts.findOne({ _id, authorId, "likes.userId": userId });

//     let res;

//     if (post) {
//       if (reaction === "like") {
//         // If reaction is 'like', remove the like
//         res = await Posts.findOneAndUpdate(
//           { _id, authorId },
//           {
//             $pull: { likes: { userId: userId } }, // Remove the like
//           },
//           { new: true } // Return the updated document
//         );
//       } else {
//         // If the user has already liked, update the existing like's reaction
//         res = await Posts.findOneAndUpdate(
//           { _id, authorId, "likes.userId": userId },
//           {
//             $set: {
//               "likes.$.reaction": reaction, // Update the reaction
//             },
//           },
//           { new: true } // Return the updated document
//         );
//       }
//     } else {
//       // If the user has not liked the post, add their like
//       res = await Posts.findOneAndUpdate(
//         { _id, authorId },
//         {
//           $push: {
//             likes: {
//               userId: userId,
//               reaction: reaction, // Add the reaction
//             },
//           },
//         },
//         { new: true } // Return the updated document
//       );
//     }

//     return res;
//   } catch (error) {
//     console.error(error);
//     throw new Error("Error toggling like: " + error.message);
//   }
// };

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

// Express.js route to get likes for a post

module.exports = {
  CreateNewPost,
  GetNewPost,
  postLike,
};
