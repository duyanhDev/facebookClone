const Users = require("./../model/users");
const sendFriendRequest = async (senderId, receiverId) => {
  try {
    console.log(senderId);

    // Update sender's friends list
    let res = await Users.findByIdAndUpdate(senderId, {
      $push: {
        friends: {
          friendId: receiverId,
          status: "pending",
          addedAt: new Date(),
        },
      },
    });

    // Update receiver's friends list
    await Users.findByIdAndUpdate(receiverId, {
      $push: {
        friends: {
          friendId: senderId,
          status: "pending",
          addedAt: new Date(),
        },
      },
    });

    console.log("Friend request sent successfully.");
  } catch (error) {
    console.error("Error sending friend request:", error);
  }
};

// chấp nhận kết bạn
const acceptFriendRequest = async (userId, friendId) => {
  try {
    // Update the friend status to accepted for both users
    await Users.updateOne(
      { _id: userId, "friends.friendId": friendId },
      { $set: { "friends.$.status": "accepted" } }
    );

    await Users.updateOne(
      { _id: friendId, "friends.friendId": userId },
      { $set: { "friends.$.status": "accepted" } }
    );

    console.log("Friend request accepted successfully.");
  } catch (error) {
    console.error("Error accepting friend request:", error);
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

    console.log("Friend request rejected successfully.");
  } catch (error) {
    console.error("Error rejecting friend request:", error);
  }
};
const listFriends = async (userId) => {
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
      (friend) => friend.status === "accepted"
    );

    return friends;
  } catch (error) {
    console.error("Error listing friends:", error);
    throw error;
  }
};
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

const getLisdFriendUserOne = async (_id) => {
  let data = await Users.findOne(_id);
  return data;
};
module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  listFriends,
  listFriendsFiter,
  getLisdFriendUserOne,
};
