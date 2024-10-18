const Comments = require("./../model/comment");
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
    } else {
      console.log("No friends to notify.");
    }
  } catch (error) {
    console.error("Error creating notifications:", error);
  }
};
const CreateCommentsNotification = async (
  postId,
  receiverId,
  senderId,
  commentId
) => {
  try {
    // console.log(
    //   "Creating notification for post:",
    //   postId,
    //   "receiverId:",
    //   receiverId,
    //   "senderId:",
    //   senderId
    // );

    // Check if senderId is defined
    if (!senderId) {
      throw new Error("senderId is required and cannot be undefined.");
    }

    // Fetch the receiver to ensure they exist
    const receiver = await Users.findById(receiverId);
    if (!receiver) {
      throw new Error("Receiver not found");
    }

    // Prepare the notification object
    const notification = {
      receiverId: receiverId,
      senderId: senderId,
      type: "comment",
      postId: postId,
      commentId: commentId,
      seen: false,
    };

    // Create the notification
    const savedNotification = await Notification.create(notification);

    return savedNotification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error; // Re-throw the error for higher-level handling
  }
};

module.exports = {
  createPostNotification,
  CreateCommentsNotification,
};
