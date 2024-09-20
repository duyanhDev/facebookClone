const Comments = require("./../model/comment");

const getComments = async () => {
  try {
    const result = await Comments.find({});
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

module.exports = {
  getComments,
  CreateComments,
};
