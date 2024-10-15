const {
  getComments,
  CreateComments,
  postCommentLike,
  getUniqueCommentersWithNames,
  CreateCommentsfeedback,
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

  let imageUrl = "";
  if (!authorId || !content) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  if (req.files && req.files.image) {
    try {
      const resultImage = await uploadFileToCloudinary(req.files.image); // Upload image và lấy URL
      imageUrl = resultImage.secure_url;
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

const CreateCommentsFeetBackAPI = async (req, res) => {
  const { postId, authorId, content, replies, receiverId, senderId } = req.body;
  console.log(senderId);

  if (!authorId || !content) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  let imageUrl = "";

  // Kiểm tra nếu có tệp hình ảnh được gửi lên
  if (req.files && req.files.image) {
    try {
      const resultImage = await uploadFileToCloudinary(req.files.image); // Upload image và lấy URL
      imageUrl = resultImage.secure_url; // Lưu URL của hình ảnh
    } catch (uploadError) {
      console.error("Error uploading image:", uploadError.message);
      return res
        .status(500)
        .json({ success: false, message: "Error uploading image" });
    }
  }

  try {
    const commentData = {
      postId: postId,
      authorId: authorId,
      content: content,
      image: imageUrl || null,
      replies: replies || [],
    };

    const results = await CreateCommentsfeedback(
      commentData,
      receiverId,
      senderId
    );

    return res.status(201).json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("Error while creating comment:", error.message);
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

const getUniqueCommentersWithNamesAPI = async (req, res) => {
  try {
    let { postId } = req.query;

    if (!postId || !Array.isArray(postId)) {
      return res.status(400).json({
        EC: 1,
        message: "Invalid postId",
      });
    }

    // Lọc các postId duy nhất để tránh gọi nhiều lần cho cùng một postId
    const uniquePostIds = [...new Set(postId)];

    // Gọi hàm getUniqueCommentersWithNames cho từng postId duy nhất
    const results = await Promise.all(
      uniquePostIds.map((id) => getUniqueCommentersWithNames(id))
    );

    return res.status(200).json({
      EC: 0,
      data: results,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EC: 1,
      message: "Server Error",
    });
  }
};
module.exports = {
  getCommentsAPI,
  CreateCommentsAPI,
  getLikesForComment,
  postLikeComment,
  getUniqueCommentersWithNamesAPI,
  CreateCommentsFeetBackAPI,
};
