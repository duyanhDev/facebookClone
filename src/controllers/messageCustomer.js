const {
  postMessAPi,
  getMessagesBetweenUsers,
  getSeenMessagesCount,
} = require("./../services/messCRUD");

const postMessages = async (req, res) => {
  let { senderId, receiverId, content, seen } = req.body;
  console.log(senderId, receiverId, content, seen);

  try {
    let result = await postMessAPi(senderId, receiverId, content, seen);
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
  let { receiverId } = req.params;
  let data = await getSeenMessagesCount(receiverId);
  console.log("id data", data);

  return res.status(200).json({
    EC: 1,
    data: data,
  });
};

module.exports = { postMessages, getMessagesAPI, getSeenMessagesAPI };
