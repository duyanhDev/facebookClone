const Messages = require("./../model/message");

// const getSeenMessagesCount = async (senderId, seen) => {
//   let count = await Messages.countDocuments({ senderId, seen: false });
//   return count;
// };
const getSeenMessagesCount = async (receiverId) => {
  try {
    // Đếm tin nhắn mà người nhận là receiverId, và tin nhắn chưa được xem (seen: false)
    let count = await Messages.countDocuments({
      receiverId,
      seen: false, // Tin nhắn chưa đọc
      senderId: { $ne: receiverId }, // Người gửi không phải là chính mình
    });
    return count;
  } catch (error) {
    console.error("Error counting unseen messages:", error);
    return 0; // Trả về 0 nếu có lỗi
  }
};

const getMessagesBetweenUsers = async (senderId, receiverId) => {
  try {
    const messages = await Messages.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    })
      .populate("senderId", "username profile.name profile.avatar") // Populate sender data
      .populate("receiverId", "username profile.name profile.avatar") // Populate receiver data
      .exec();

    return messages;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};
const postMessAPi = async (senderId, receiverId, content) => {
  try {
    // Nếu người gửi là chính họ thì seen: true, người nhận thì seen: false
    const seen = senderId === receiverId ? true : false;

    // Tạo tin nhắn và trả về dữ liệu
    const data = await Messages.create({
      senderId,
      receiverId,
      content,
      seen,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log(data);
    return data; // Trả về kết quả tạo tin nhắn
  } catch (error) {
    console.error("Error creating message:", error);
    throw error; // Ném lỗi để controller xử lý
  }
};

module.exports = { getSeenMessagesCount, postMessAPi, getMessagesBetweenUsers };
