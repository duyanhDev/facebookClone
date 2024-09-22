const {
  getComments,
  CreateComments,
  postCommentLike,
} = require("./../services/comment");
const {
  uploadFileToCloudinary,
  uploadVideoToCloudinary,
} = require("./../services/Cloudinary");

const Comments = require("./../model/comment");

// hiển thị bình luận
const getCommentsAPI = async (req, res) => {
  try {
    const result = await getComments();
    return res.status(200).json({
      EC: 0,
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Error uploading image" });
  }
};

// thêm bình luận
const CreateCommentsAPI = async (req, res) => {
  let { postId, authorId, content, replies } = req.body;
  console.log(authorId);

  let imageUrl = "";
  if (!authorId || !content) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }
  console.log("gg", req.files);

  // Handle video upload if provided
  console.log("Uploaded files:", req.files);
  if (req.files && req.files.image) {
    try {
      const resultImage = await uploadFileToCloudinary(req.files.image); // Upload image và lấy URL
      imageUrl = resultImage.secure_url; // Gán link image sau khi upload thành công
      console.log("Image URL:", imageUrl);
    } catch (uploadError) {
      console.error("Error uploading image:", uploadError.message);
      return res
        .status(500)
        .json({ success: false, message: "Error uploading image" });
    }
  }

  try {
    let Commentdata = {
      postId: postId,
      authorId: authorId,
      content: content,
      image: imageUrl || null,
      replies: replies || [],
    };

    let results = await CreateComments(Commentdata);
    return res.status(201).json({
      EC: 0,
      data: results,
    });
  } catch (error) {
    console.error("Error while creating post:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
const getLikesForComment = async (req, res) => {
  try {
    const { postIds } = req.params;
    const idsArray = postIds.split(",");

    if (idsArray.length === 0) {
      return res.status(400).json({ message: "No post IDs provided" });
    }

    const posts = await Comments.find({ _id: { $in: idsArray } }).populate({
      path: "likes.userId",
      select: "profile.name", // Ensure profile.name is included
    });

    if (!posts.length) {
      return res.status(404).json({ message: "Posts not found" });
    }

    const results = posts.map((post) => ({
      _id: post._id,
      totalLikes: post.likes.length,
      likes: post.likes.map((like) => ({
        userId: like.userId ? like.userId._id : null,
        name: like.userId ? like.userId.profile.name : "Unknown",
        reaction: like.reaction,
      })),
    }));

    return res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching likes:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const postLikeComment = async (req, res) => {
  try {
    let { _id, authorId, like } = req.body;
    const { userId, reaction } = like;

    console.log("Request data:", { _id, authorId, userId, reaction });

    let data = await postCommentLike(_id, authorId, userId, reaction);

    if (!data) {
      return res.status(404).json({
        EC: 1,
        message: "Post not found or like operation failed",
      });
    }

    return res.status(200).json({
      EC: 0,
      data: data,
    });
  } catch (error) {
    console.error("Error in postLikeUser:", error);
    return res.status(500).json({
      EC: 1,
      message: "Error liking post",
    });
  }
};
module.exports = {
  getCommentsAPI,
  CreateCommentsAPI,
  getLikesForComment,
  postLikeComment,
};
