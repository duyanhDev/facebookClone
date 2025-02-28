const { default: mongoose } = require("mongoose");
const Notification = require("../model/notification");
const Users = require("../model/users");

const getNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const notifications = await Notification.find({ receiverId: userId })
      .populate({
        path: "senderId",
        select: "profile.name profile.avatar username", // Lấy thêm tên và avatar từ profile
        model: Users,
      })
      .populate("postId", "content image")
      .sort({ createdAt: -1 });

    // Định dạng lại dữ liệu để dễ sử dụng hơn ở client
    const formattedNotifications = notifications.map((notification) => ({
      ...notification.toObject(),
      sender: {
        _id: notification.senderId._id,
        username: notification.senderId.username,
        name: notification.senderId.profile.name,
        avatar: notification.senderId.profile.avatar,
      },
      senderId: undefined, // Xóa senderId gốc để tránh trùng lặp
    }));

    res
      .status(200)
      .json({ success: true, notifications: formattedNotifications });
  } catch (error) {
    console.error("Lỗi khi lấy thông báo:", error);
    res
      .status(500)
      .json({ success: false, message: "Đã xảy ra lỗi khi lấy thông báo" });
  }
};

const getCountNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Kiểm tra userId có hợp lệ không trước khi truy vấn
    if (
      !userId ||
      userId === "null" ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({
        EC: 1,
        EM: "UserId không hợp lệ",
      });
    }

    // Chuyển userId thành ObjectId
    const objectIdUserId = new mongoose.Types.ObjectId(userId);

    // Truy vấn dữ liệu
    const data = await Notification.countDocuments({
      receiverId: objectIdUserId,
      seen: false,
    }).exec();

    return res.status(200).json({
      EC: 0,
      data: data,
    });
  } catch (error) {
    console.error("Lỗi getCountNotifications:", error);
    return res.status(500).json({
      EC: 1,
      EM: "Lỗi server",
    });
  }
};

module.exports = {
  getNotifications,
  getCountNotifications,
};
