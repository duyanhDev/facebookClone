const {
  postMessAPi,
  getMessagesBetweenUsers,
  getSeenMessagesCount,
  putMessage,
  GetseenAllMess,
} = require("./../services/messCRUD");

const { uploadFileToCloudinary } = require("./../services/Cloudinary");

const postMessages = async (req, res) => {
  let { senderId, receiverId, content, seen } = req.body;
  console.log(senderId, receiverId, content, seen);

  let imageUrls = [];

  if (req.files && req.files.image) {
    try {
      const files = Array.isArray(req.files.image)
        ? req.files.image
        : [req.files.image]; // Đảm bảo files là một mảng

      // Upload từng ảnh và lưu URL
      for (const file of files) {
        const resultImage = await uploadFileToCloudinary(file); // Upload ảnh
        imageUrls.push(resultImage.secure_url); // Lưu URL vào mảng
      }
    } catch (uploadError) {
      console.error("Error uploading images:", uploadError.message);
      return res
        .status(500)
        .json({ success: false, message: "Error uploading images" });
    }
  }
  try {
    let result = await postMessAPi(
      senderId,
      receiverId,
      content,
      imageUrls,
      seen
    );
    console.log("Kết quả:", result);

    return res
      .status(200)
      .json({ message: "Tin nhắn thành công", data: result });
  } catch (error) {
    console.error("Error posting message:", error);
    return res.status(500).json({ error: "Đã xảy ra lỗi khi gửi tin nhắn" });
  }
};
const getMessagesAPI = async (req, res) => {
  try {
    // Validate request body
    const { senderId, receiverId } = req.params;
    if (!senderId || !receiverId) {
      return res.status(400).json({
        EC: 0,
        message: "Invalid sender or receiver ID",
      });
    }

    // Fetch messages between users
    const result = await getMessagesBetweenUsers(senderId, receiverId);

    // Handle case where no messages are found
    if (!result) {
      return res.status(404).json({
        EC: 0,
        message: "Messages not found",
      });
    }

    // Return success response
    return res.status(200).json({
      EC: 1,
      data: result,
    });
  } catch (error) {
    // Handle server error
    console.error("Error in getMessagesAPI:", error);
    return res.status(500).json({
      EC: 0,
      message: "Internal Server Error",
    });
  }
};
const getSeenMessagesAPI = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const count = await getSeenMessagesCount(receiverId);
    res.status(200).json({
      EC: 1, // Mã trạng thái thành công
      data: count, // Dữ liệu trả về
    });
  } catch (error) {
    console.error("Error getting seen messages count:", error);
    res.status(500).json({
      EC: 0, // Mã trạng thái lỗi
      message: "Internal server error",
    });
  }
};

const putMessageAPI = async (req, res) => {
  let { senderId, receiverId } = req.params;

  try {
    // Gọi hàm putMessage để cập nhật tin nhắn
    const result = await putMessage(senderId, receiverId);

    // Kiểm tra kết quả từ hàm putMessage
    if (result.modifiedCount > 0) {
      return res.status(200).json({
        EC: 0,
        data: result,
      });
    } else {
      return res.status(200).json({
        EC: 1,
        message: "No messages were updated",
        data: result,
      });
    }
  } catch (error) {
    console.error("Error updating seen messages:", error);
    return res.status(500).json({
      EC: -1,
      message: "Failed to update seen messages",
    });
  }
};

const getAllMessAPI = async (req, res) => {
  try {
    let { receiverId } = req.params;
    let data = await GetseenAllMess(receiverId);

    return res.status(200).json({
      EC: 0,
      data: data,
    });
  } catch (error) {
    console.error("Error updating seen messages:", error);
    return res.status(500).json({
      EC: -1,
      message: "Failed to update seen messages",
    });
  }
};

module.exports = {
  postMessages,
  getMessagesAPI,
  getSeenMessagesAPI,
  putMessageAPI,
  getAllMessAPI,
};
