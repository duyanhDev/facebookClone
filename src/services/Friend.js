const Users = require("./../model/users");
const mongoose = require("mongoose");
const sendFriendRequest = async (senderId, receiverId) => {
  try {
    // Kiểm tra nếu senderId và receiverId trùng nhau
    if (senderId.toString() === receiverId.toString()) {
      throw new Error("Cannot send friend request to yourself.");
    }

    // Tìm người dùng gửi và nhận lời mời kết bạn
    const sender = await Users.findById(senderId);
    const receiver = await Users.findById(receiverId);

    if (!sender || !receiver) {
      throw new Error("User not found");
    }

    // Kiểm tra nếu người dùng đã là bạn
    const senderIsFriend = sender.friends.some(
      (friend) =>
        friend.friendId.toString() === receiverId.toString() &&
        friend.status === "accepted"
    );
    const receiverIsFriend = receiver.friends.some(
      (friend) =>
        friend.friendId.toString() === senderId.toString() &&
        friend.status === "accepted"
    );

    if (senderIsFriend || receiverIsFriend) {
      throw new Error("You are already friends with this user.");
    }

    // Kiểm tra nếu lời mời kết bạn đã tồn tại
    const requestAlreadySentBySender = sender.friends.some(
      (friend) =>
        friend.friendId.toString() === receiverId.toString() &&
        friend.status === "pending"
    );
    const requestAlreadySentByReceiver = receiver.friends.some(
      (friend) =>
        friend.friendId.toString() === senderId.toString() &&
        friend.status === "pending"
    );

    if (requestAlreadySentBySender || requestAlreadySentByReceiver) {
      throw new Error("Friend request already sent.");
    }

    // Cập nhật danh sách bạn bè của người gửi
    await Users.findByIdAndUpdate(senderId, {
      $push: {
        friends: {
          friendId: receiverId,
          status: "pending",
          addedAt: new Date(),
        },
      },
    });

    // Cập nhật danh sách bạn bè của người nhận
    await Users.findByIdAndUpdate(receiverId, {
      $push: {
        friends: {
          friendId: senderId,
          status: "pending",
          addedAt: new Date(),
        },
      },
    });
  } catch (error) {
    console.error("Error sending friend request:", error.message);
  }
};

// chấp nhận kết bạn
const acceptFriendRequest = async (userId, friendIds) => {
  try {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const friendIdArray = friendIds.split(",");

    for (const friendId of friendIdArray) {
      const friendObjectId = new mongoose.Types.ObjectId(friendId.trim());

      // Update the friend status to accepted for the user
      await Users.updateOne(
        { _id: userObjectId, "friends.friendId": friendObjectId },
        { $set: { "friends.$.status": "accepted" } }
      );

      // Update the friend status to accepted for the friend
      await Users.updateOne(
        { _id: friendObjectId, "friends.friendId": userObjectId },
        { $set: { "friends.$.status": "accepted" } }
      );
    }

    return { success: true, message: "Friend request accepted successfully." }; // Return a success message
  } catch (error) {
    console.error("Error accepting friend request:", error);
    return { success: false, message: "Error accepting friend request." }; // Return an error message
  }
};

const rejectFriendRequest = async (userId, friendId) => {
  try {
    // Remove the friend entry from both users
    await Users.updateOne(
      { _id: userId },
      { $pull: { friends: { friendId: friendId } } }
    );

    await Users.updateOne(
      { _id: friendId },
      { $pull: { friends: { friendId: userId } } }
    );
  } catch (error) {
    console.error("Error rejecting friend request:", error);
  }
};

// kết bạn rồi
const listFriends = async (userId) => {
  try {
    const user = await Users.findById(userId)
      .populate({
        path: "friends.friendId",
        select: "username isOnline profile.name profile.avatar ",
      })
      .exec();

    if (!user) {
      console.log(`User with ID ${userId} not found`);
      return [];
    }

    const friends = user.friends.filter(
      (friend) => friend.status === "accepted"
    );

    return friends;
  } catch (error) {
    console.error("Error listing friends:", error);
    throw error;
  }
};

// chờ két bạn
const listFriendsFiter = async (userId) => {
  try {
    const user = await Users.findById(userId)
      .populate({
        path: "friends.friendId",
        select: "username profile.name profile.avatar",
      })
      .exec();

    if (!user) {
      console.log(`User with ID ${userId} not found`);
      return [];
    }

    const friends = user.friends.filter(
      (friend) => friend.status === "pending"
    );

    return friends;
  } catch (error) {
    console.error("Error listing friends:", error);
    throw error;
  }
};
//danh sách thông tin  id
const getLisdFriendUserOne = async (_id) => {
  let data = await Users.findOne(_id);
  try {
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  listFriends,
  listFriendsFiter,
  getLisdFriendUserOne,
};
