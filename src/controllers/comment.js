const { getComments, CreateComments } = require("./../services/comment");
const {
  uploadFileToCloudinary,
  uploadVideoToCloudinary,
} = require("./../services/Cloudinary");

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

module.exports = {
  getCommentsAPI,
  CreateCommentsAPI,
};
