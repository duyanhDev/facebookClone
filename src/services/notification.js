const Notification = require("../model/notification");
const Users = require("../model/users");

const createPostNotification = async (postId, authorId) => {
  try {
    const Author = await Users.findById(authorId);
    if (!Author) {
      throw new Error("Không tìm thấy tác giả");
    }

    const friends = Author.friends.filter(
      (friend) => friend.status === "accepted"
    );

    const notifications = friends.map((friend) => ({
      receiverId: friend.friendId,
      senderId: authorId,
      type: "new_post",
      postId: postId,
      seen: false,
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
      console.log("Notifications created for friends:", notifications);
    } else {
      console.log("No friends to notify.");
    }
  } catch (error) {
    console.error("Error creating notifications:", error);
  }
};

module.exports = {
  createPostNotification,
};
