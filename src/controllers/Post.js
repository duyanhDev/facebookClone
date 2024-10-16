const {
  uploadFileToCloudinary,
  uploadVideoToCloudinary,
} = require("./../services/Cloudinary");
const {
  CreateNewPost,
  GetNewPost,
  postLike,
} = require("./../services/PostSchema");

const Posts = require("./../model/post");
const Users = require("../model/users");

const createNewPostUser = async (req, res) => {
  const { authorId, content, taggedFriends } = req.body;
  let videoUrl = "";
  let imageUrl = "";

  // Validate required fields
  if (!authorId || !content) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }
  console.log("gg", req.files);

  // Handle video upload if provided
  console.log("Uploaded files:", req.files);

  // Handle video upload if provided
  if (req.files && req.files.video) {
    const videoFile = req.files.video;
    try {
      videoUrl = await uploadVideoToCloudinary(videoFile); // Upload video and get the URL
      console.log("Video URL:", videoUrl);
    } catch (error) {
      console.error("Error uploading video:", error.message);
      return res
        .status(500)
        .json({ success: false, message: "Error uploading video" });
    }
  }
  // Handle image upload if provided
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
    // Prepare data for post creation
    const data = {
      authorId,
      content,
      image: imageUrl || null, // Lưu URL ảnh hoặc null nếu không có
      video: videoUrl || null, // Lưu URL video hoặc null nếu không có
      taggedFriends: taggedFriends || [], // Danh sách bạn bè tag
    };

    console.log("Data to create post:", data);

    // Tạo bài viết mới
    const newPost = await CreateNewPost(data);
    return res.status(201).json({
      success: true,
      data: newPost,
    });
  } catch (error) {
    console.error("Error while creating post:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const getNewPostUsers = async (req, res) => {
  try {
    let data = await GetNewPost();
    return res.status(200).json({
      EC: 0,
      data: data,
    });
  } catch (error) {
    console.error("Error while creating post:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
const postLikeUser = async (req, res) => {
  try {
    let { _id, authorId, like } = req.body;
    const { userId, reaction } = like;

    let data = await postLike(_id, authorId, userId, reaction);

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

// src/controllers/Post.js
const getLikesForPost = async (req, res) => {
  try {
    const { postIds } = req.params;
    const idsArray = postIds.split(",");

    if (idsArray.length === 0) {
      return res.status(400).json({ message: "No post IDs provided" });
    }

    const posts = await Posts.find({ _id: { $in: idsArray } }).populate({
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

module.exports = {
  createNewPostUser,
  getNewPostUsers,
  postLikeUser,
  getLikesForPost,
};
