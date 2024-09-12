const { uploadSingleFile } = require("./../services/fileSerive");
const {
  getReadUser,
  postCreateUser,
  postLoginJWT,
  putUserAPI,
} = require("./../services/CRUDUser");
const {
  sendFriendRequest,
  acceptFriendRequest,
  listFriends,
  listFriendsFiter,
  getLisdFriendUserOne,
} = require("./../services/Friend");
const { uploadFileToCloudinary } = require("./../services/Cloudinary");

const mongoose = require("mongoose");

const postUpdateFile = async (req, res) => {
  let image;
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  } else {
    const result = await uploadSingleFile(req.files.image);
    console.log(result);
  }
  return res.send("upload ảnh thành công");
};

// read user

const getReadUserFB = async (req, res) => {
  try {
    let result = await getReadUser();
    return res.status(200).json({
      EC: 0,
      data: result,
    });
  } catch (error) {}
};

// thêm users
const postUpdateUserFB = async (req, res) => {
  try {
    let {
      username,
      email,
      password,
      profile: { name, gender, birthday, bio, avatar, coverPhoto },
      friends = [],
      role,
    } = req.body;

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    let imageUrl = "";
    if (req.files && req.files.avatar) {
      const result = await uploadFileToCloudinary(req.files.avatar);
      imageUrl = result.path;
      console.log("Image URL:", imageUrl);
    }

    const friendsData = friends.map((friend) => ({
      friendId: new mongoose.Types.ObjectId(friend.friendId),
      status: friend.status,
      addedAt: new Date(friend.addedAt),
    }));

    const newUser = {
      username,
      email,
      password,
      profile: {
        name,
        gender,
        birthday,
        bio,
        avatar: imageUrl || avatar,
        coverPhoto,
      },
      friends: friendsData,
      role,
    };

    let result = await postCreateUser(newUser);
    console.log(result);
    return res.send("Create thành công");
  } catch (error) {
    console.error("Error creating user:", error);
  }
};

const putProfileUser = async (req, res) => {
  let { id } = req.params;
  let { username, password, role } = req.body;

  let imageUrl = "";
  if (req.files && req.files.avatar) {
    try {
      const result = await uploadFileToCloudinary(req.files.avatar);
      imageUrl = result.secure_url; // Sử dụng secure_url để lấy URL của ảnh đã tải lên
      console.log("Image URL:", imageUrl);
    } catch (error) {
      console.error("Error uploading file:", error);
      return res.status(500).json({
        EC: 0,
        message: "Failed to upload image.",
      });
    }
  }

  try {
    let result = await putUserAPI(id, username, password, role, imageUrl);
    return res.status(200).json({
      EC: 1,
      data: result,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({
      EC: 0,
      message: "Failed to update user.",
    });
  }
};

// gửi lời mời kb
const postAddFriends = async (req, res) => {
  let { senderId, receiverId } = req.body;
  console.log(senderId, receiverId);

  let result = await sendFriendRequest(senderId, receiverId);

  return res.status(200).json({
    EC: 0,
    data: result,
  });
};

// // chấp nhận kết bạn
const putAddFriends = async (req, res) => {
  let { userId, friendId } = req.body;
  console.log(userId, friendId);

  let result = await acceptFriendRequest(userId, friendId);

  return res.status(200).json({
    EC: 0,
    data: result,
  });
};
const getListFriendSAdd = async (req, res) => {
  try {
    const { id } = req.params; // Lấy userId từ URL params
    console.log("UserId from params:", id);

    if (!id) {
      return res.status(400).json({ message: "userId is required" });
    }

    const result = await listFriendsFiter(id);
    console.log("Friends list:", result);

    if (!result) {
      return res.status(404).json({ message: "User not found or no friends" });
    }

    return res.json(result);
  } catch (error) {
    console.error("Error listing friends:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
// lấy danh sách bạn bè
const getListFriendUser = async (req, res) => {
  try {
    const { id } = req.params; // Lấy userId từ URL params
    console.log("UserId from params:", id);

    if (!id) {
      return res.status(400).json({ message: "userId is required" });
    }

    const result = await listFriends(id);
    console.log("Friends list:", result);

    if (!result) {
      return res.status(404).json({ message: "User not found or no friends" });
    }

    return res.json(result);
  } catch (error) {
    console.error("Error listing friends:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

//  đăng nhập
const postLogin = async (req, res) => {
  let { email, password } = req.body;

  // Gọi hàm xử lý đăng nhập
  let result = await postLoginJWT(email, password);

  // Kiểm tra kết quả và phản hồi lại cho client
  if (!result.success) {
    return res.status(400).json({
      EC: 1, // Error code
      message: result.message, // Thông báo lỗi
    });
  }

  // Nếu thành công, trả về token và refresh token
  return res.status(200).json({
    EC: 0, // Success code
    message: "Đăng nhập thành công",
    token: result.token, // Token JWT
    refreshToken: result.refreshToken,
    data: result.user,

    // Refresh token
  });
};

module.exports = {
  getReadUserFB,
  postUpdateUserFB,
  getReadUserFB,
  postAddFriends,
  putAddFriends,
  getListFriendSAdd,
  getListFriendUser,
  postLogin,
  putProfileUser,
};
