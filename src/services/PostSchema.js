// src/services/PostSchema.js
const Posts = require("./../model/post");

const GetNewPost = async () => {
  try {
    let res = await Posts.find({}).sort({ createdAt: -1 });
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
    // Find the post to check if the user has already liked it
    const post = await Posts.findOne({ _id, authorId, "likes.userId": userId });

    let res;

    if (post) {
      // If the user already liked the post
      if (reaction === "like") {
        // If reaction is null, it means the user wants to unlike
        res = await Posts.findOneAndUpdate(
          { _id, authorId },
          {
            $pull: { likes: { userId: userId } }, // Remove the like
          },
          { new: true } // Return the updated document
        );
      } else {
        // If user has already liked, update the existing like's reaction
        res = await Posts.findOneAndUpdate(
          { _id, authorId, "likes.userId": userId },
          {
            $set: {
              "likes.$.reaction": reaction || "like", // Update the reaction
            },
          },
          { new: true } // Return the updated document
        );
      }
    } else {
      // If the user has not liked the post, add their like
      res = await Posts.findOneAndUpdate(
        { _id, authorId },
        {
          $push: {
            likes: {
              userId: userId,
              reaction: reaction || "like", // Add the reaction
            },
          },
        },
        { new: true } // Return the updated document
      );
    }

    return res;
  } catch (error) {
    console.error(error);
    throw new Error("Error toggling like");
  }
};

// Express.js route to get likes for a post

module.exports = {
  CreateNewPost,
  GetNewPost,
  postLike,
};
