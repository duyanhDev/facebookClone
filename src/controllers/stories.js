const { CreateStories, GetAllStories } = require("./../services/stories");
const {
  uploadFileToCloudinary,
  uploadVideoToCloudinary,
} = require("./../services/Cloudinary");

const CreateStoriesAPI = async (req, res) => {
  try {
    const { authorId, content, visibility } = req.body;
    if (!authorId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    }
    let ImageUrl = "";
    let videoUrl = "";

    if (req.files && req.files.video) {
      const videoFile = req.files.video;
      try {
        const resultVideo = await uploadVideoToCloudinary(videoFile);
        videoUrl = resultVideo.secure_url;
      } catch (error) {
        console.error("Error uploading video:", error.message);
        return res
          .status(500)
          .json({ success: false, message: "Error uploading video" });
      }
    }

    if (req.files && req.files.images) {
      const ImageFiles = req.files.images;
      try {
        const resultImage = await uploadFileToCloudinary(ImageFiles);
        ImageUrl = resultImage.secure_url;
      } catch (error) {
        return res
          .status(500)
          .json({ success: false, message: "Error uploading video" });
      }
    }

    const data = {
      authorId,
      content,
      images: ImageUrl || "",
      video: videoUrl || "",
      visibility: visibility || "public",
    };

    console.log(data);

    const creatStories = await CreateStories(data);
    return res.status(201).json({
      success: true,
      data: creatStories,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const GetAllStoriesAPI = async (req, res) => {
  try {
    const data = await GetAllStories();
    return res.status(200).json({
      EC: 0,
      data: data,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { CreateStoriesAPI, GetAllStoriesAPI };
