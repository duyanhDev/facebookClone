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
    const data = await Notification.countDocuments({
      receiverId: userId,
      seen: false,
    }).exec();

    return res.status(200).json({
      EC: 0,
      data: data,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getNotifications,
  getCountNotifications,
};
