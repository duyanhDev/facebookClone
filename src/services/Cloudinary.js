const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const streamifier = require("streamifier"); // Cài đặt thư viện streamifier

const uploadFileToCloudinary = async (file) => {
  try {
    // Cấu hình Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });

    // Sử dụng streamifier để chuyển đổi Buffer thành stream
    const streamUpload = (file) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { public_id: `uploads/shoes-${Date.now()}` },
          (error, result) => {
            if (error) reject(error);
            resolve(result);
          }
        );

        streamifier.createReadStream(file.data).pipe(uploadStream);
      });
    };

    // Gọi hàm streamUpload để tải tệp lên
    const uploadResult = await streamUpload(file);

    console.log("Upload result:", uploadResult);
    return uploadResult;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error; // Ném lỗi ra ngoài nếu có
  }
};

const uploadVideoToCloudinary = async (file) => {
  try {
    if (!file || !file.data) {
      throw new Error("Invalid file object or missing data.");
    }

    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });

    const streamUpload = (fileData) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "video",
            public_id: `uploads/videos-${Date.now()}`,
          },
          (error, result) => {
            if (error) {
              console.error("Error uploading video:", error);
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        streamifier.createReadStream(fileData).pipe(uploadStream);
      });
    };

    const uploadResult = await streamUpload(file.data);
    console.log("Upload result:", uploadResult); // Kiểm tra đầu ra
    return uploadResult.secure_url; // Trả về URL của video sau khi upload
  } catch (error) {
    console.error("Error uploading video to Cloudinary:", error);
    throw error;
  }
};

// Xuất hàm uploadVideoToCloudinary

// Xuất hàm uploadFileToCloudinary
module.exports = {
  uploadFileToCloudinary,
  uploadVideoToCloudinary,
};
