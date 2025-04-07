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

const Users = require("../model/users");

const mongoose = require("mongoose");
const { status } = require("nprogress");
const moment = require("moment");
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
    const {
      username,
      email,
      password,
      name, // Extract directly from req.body
      gender,
      birthday,
      bio,
      coverPhoto, // No need to destructure from profile, as FormData flattens fields
      friends = [],
      role,
    } = req.body;

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    let imageUrl = "";
    if (req.files && req.files.avatar) {
      console.log(req.files, "and", req.files.avatar);

      try {
        const result = await uploadFileToCloudinary(req.files.avatar);
        console.log(result);

        imageUrl = result.secure_url; // Use secure_url to get the uploaded image URL
        console.log("Image URL:", imageUrl);
      } catch (error) {
        console.error("Error uploading file:", error);
        return res.status(500).json({
          EC: 0,
          message: "Failed to upload image.",
        });
      }
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
        avatar: imageUrl, // Ensure avatar is set to the uploaded image URL
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
    res.status(500).send("Internal server error");
  }
};

const putProfileUser = async (req, res) => {
  let { id } = req.params;
  let {
    email,
    username,
    password,
    role,
    name,
    gender,
    birthday,
    bio,
    currentCity,
    hometown,
    introduce,
    relationshipStatus,
    languages,
    websites,
    school,
    degree,
    fieldOfStudy,
    startDate,
    endDate,
    current,
    educationIndex,
    company,
    position,
    startDate1,
    endDate1,
    current1,
    workIndex,
  } = req.body;

  try {
    let user = await Users.findById(id);
    if (!user) {
      return res.status(404).json({ EC: 0, message: "User not found." });
    }

    // Kiểm tra avatar
    let imageUrl = user.profile?.avatar || "";
    console.log("avatar", req.files);
    if (req.files?.avatar) {
      try {
        const result = await uploadFileToCloudinary(req.files.avatar);
        imageUrl = result.secure_url;
      } catch (error) {
        console.error("Error uploading file:", error);
        return res
          .status(500)
          .json({ EC: 0, message: "Failed to upload image." });
      }
    }

    // Cập nhật thông tin user
    const updateData = {
      email: email !== undefined ? email : user.email,
      username: username !== undefined ? username : user.username,
      role: role !== undefined ? role : user.role,
      profile: {
        ...user.profile,
        name: name !== undefined ? name : user.profile?.name,
        gender: gender !== undefined ? gender : user.profile?.gender,
        birthday: birthday !== undefined ? birthday : user.profile?.birthday,
        bio: bio !== undefined ? bio : user.profile?.bio,
        avatar: imageUrl,
        currentCity:
          currentCity !== undefined ? currentCity : user.profile?.currentCity,
        hometown: hometown !== undefined ? hometown : user.profile?.hometown,
        introduce:
          introduce !== undefined ? introduce : user.profile?.introduce,
        relationshipStatus:
          relationshipStatus !== undefined
            ? relationshipStatus
            : user.profile?.relationshipStatus,
        languages:
          languages !== undefined ? languages : user.profile?.languages,
        websites: websites !== undefined ? websites : user.profile?.websites,
        education: user.profile?.education || [],
        work: user.profile?.work || [],
      },
    };

    // Cập nhật mật khẩu nếu có
    if (password?.trim()) {
      updateData.password = password; // Cần mã hóa trước khi lưu
    }

    // Cập nhật education - Chỉ khi có ít nhất một trường hợp lệ
    if (
      school !== undefined ||
      degree !== undefined ||
      fieldOfStudy !== undefined ||
      startDate !== undefined ||
      endDate !== undefined ||
      current !== undefined
    ) {
      const newEducationEntry = {
        school:
          school !== undefined && school !== null && school !== ""
            ? school
            : undefined,
        degree:
          degree !== undefined && degree !== null && degree !== ""
            ? degree
            : undefined,
        fieldOfStudy:
          fieldOfStudy !== undefined &&
          fieldOfStudy !== null &&
          fieldOfStudy !== ""
            ? fieldOfStudy
            : undefined,
        startDate:
          startDate !== undefined && startDate !== null ? startDate : undefined,
        endDate:
          endDate !== undefined && endDate !== null ? endDate : undefined,
        current: current !== undefined ? current : undefined,
      };

      // Kiểm tra xem có ít nhất một trường hợp lệ không
      const hasValidEducationData = Object.values(newEducationEntry).some(
        (value) => value !== undefined
      );

      if (hasValidEducationData) {
        const finalEducationEntry = {
          school: newEducationEntry.school || "",
          degree: newEducationEntry.degree || "",
          fieldOfStudy: newEducationEntry.fieldOfStudy || "",
          startDate: newEducationEntry.startDate || null,
          endDate: newEducationEntry.endDate || null,
          current: newEducationEntry.current || false,
        };

        if (
          educationIndex !== undefined &&
          educationIndex >= 0 &&
          educationIndex < updateData.profile.education.length
        ) {
          updateData.profile.education[educationIndex] = {
            ...updateData.profile.education[educationIndex],
            ...finalEducationEntry,
          };
        } else {
          updateData.profile.education.push(finalEducationEntry);
        }
      }
    }

    // Cập nhật work - Chỉ khi có ít nhất một trường hợp lệ
    if (
      company !== undefined ||
      position !== undefined ||
      startDate1 !== undefined ||
      endDate1 !== undefined ||
      current1 !== undefined
    ) {
      const newWorkEntry = {
        company:
          company !== undefined && company !== null && company !== ""
            ? company
            : undefined,
        position:
          position !== undefined && position !== null && position !== ""
            ? position
            : undefined,
        startDate:
          startDate1 !== undefined && startDate1 !== null
            ? startDate1
            : undefined,
        endDate:
          endDate1 !== undefined && endDate1 !== null ? endDate1 : undefined,
        current: current1 !== undefined ? current1 : undefined,
      };

      // Kiểm tra xem có ít nhất một trường hợp lệ không
      const hasValidWorkData = Object.values(newWorkEntry).some(
        (value) => value !== undefined
      );

      if (hasValidWorkData) {
        const finalWorkEntry = {
          company: newWorkEntry.company || "",
          position: newWorkEntry.position || "",
          startDate: newWorkEntry.startDate || null,
          endDate: newWorkEntry.endDate || null,
          current: newWorkEntry.current || false,
        };

        if (
          workIndex !== undefined &&
          workIndex >= 0 &&
          workIndex < updateData.profile.work.length
        ) {
          updateData.profile.work[workIndex] = {
            ...updateData.profile.work[workIndex],
            ...finalWorkEntry,
          };
        } else {
          updateData.profile.work.push(finalWorkEntry);
        }
      }
    }

    // Cập nhật vào database
    let result = await putUserAPI(id, updateData);
    console.log(result.data);

    return res.status(result.success ? 200 : 400).json({
      EC: result.success ? 1 : 0,
      data: result.data,
      message: result.success ? "User updated successfully." : result.message,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ EC: 0, message: "Failed to update user." });
  }
};

// gửi lời mời kb
const postAddFriends = async (req, res) => {
  let { senderId, receiverId } = req.body;
  const io = req.app.get("io");

  let result = await sendFriendRequest(senderId, receiverId, io);

  return res.status(200).json({
    EC: 0,
    data: result,
  });
};

// // chấp nhận kết bạn
const putAddFriends = async (req, res) => {
  let { userId, friendId } = req.params;
  console.log("check222", userId, friendId);

  let result = await acceptFriendRequest(userId, friendId);
  console.log(result);

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
  let { email, username, password } = req.body;
  console.log(email, username, password);

  // Gọi hàm xử lý đăng nhập
  let result = await postLoginJWT(email, username, password);

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

const getProfileUser = async (req, res) => {
  try {
    let { id } = req.params;
    console.log(id);
    let data = await Users.findOne({ _id: id })
      .populate({
        path: "friends.friendId",
        select: "username profile.name profile.avatar",
      })
      .populate({
        path: "posts", // Lấy danh sách bài viết của user
        select:
          "content image video likes comments privacy createdAt checkImage",
        populate: [
          {
            path: "likes.userId",
            select: "username profile.avatar",
          },
        ],
      })
      .exec();
    console.log(data);
    return res.status(200).json({
      EC: 0,
      data: data,
    });
  } catch (error) {
    console.log(error);
  }
};

const updateIntroduce = async (req, res) => {
  try {
    let { userId } = req.query;
    let { introduce } = req.body;

    const data = await Users.findByIdAndUpdate(
      userId, // Truyền trực tiếp userId (nếu là ObjectId hợp lệ)
      { "profile.introduce": introduce }, // Chỉ cập nhật trường introduce
      { new: true } // Trả về dữ liệu mới sau khi update
    );

    if (!data) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const UpdateWorkByConditions = async (req, res) => {
  try {
    const { userId, workId, position, company } = req.body;

    const user = await Users.findOneAndUpdate(
      { _id: userId, "profile.work._id": workId }, // Điều kiện tìm kiếm
      {
        $set: {
          "profile.work.$.position": position,
          "profile.work.$.company": company,
        },
      },
      { new: true } // Trả về dữ liệu mới sau khi cập nhật
    );

    if (!user) {
      return res.status(404).json({ message: "User or work entry not found" });
    }

    res.json({ message: "Update successful", status: 200, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const APICreateWorkUser = async (req, res) => {
  try {
    let { id } = req.params;
    let { company, position, startDate, endDate, current = false } = req.body;
    console.log(id);

    console.log(company, position, startDate, endDate, current);

    // Tìm user theo ID
    const user = await Users.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Tạo object công việc mới
    const newWork = {
      company,
      position,
      startDate,
      endDate,
      current,
    };

    // Thêm công việc mới vào mảng work
    user.profile.work.push(newWork);

    // Lưu lại thay đổi
    await user.save();

    return res
      .status(200)
      .json({ message: "Công việc đã được thêm thành công!", user });
  } catch (error) {
    console.error("Lỗi khi thêm công việc:", error);
    return res.status(500).json({ message: "Lỗi server", error });
  }
};

const createEducationAPI = async (req, res) => {
  try {
    let { id } = req.params;

    // Chuyển đổi sang đúng định dạng ISO 8601

    let { school, degree, fieldOfStudy, startDate, endDate, current } =
      req.body;

    const startDateString = moment(startDate, "DD-MM-YYYY").toDate();
    const endDateString = moment(endDate, "DD-MM-YYYY").toDate();

    const user = await Users.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    }

    if (!user.profile) {
      user.profile = { education: [] };
    }

    const newEducation = {
      school,
      degree,
      fieldOfStudy,
      startDateString,
      endDateString,
      current,
    };

    user.profile.education.push(newEducation);

    await user.save();

    return res
      .status(200)
      .json({ message: "Trường đại học đã được thêm thành công!", user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

const UpdateEducation = async (req, res) => {
  try {
    const {
      userId,
      idSchool,
      school,
      degree,
      fieldOfStudy,
      startDate,
      endDate,
    } = req.body;

    console.log(startDate, endDate);

    const startDateString = moment(startDate, "DD-MM-YYYY").toDate();
    const endDateString = moment(endDate, "DD-MM-YYYY").toDate();
    const user = await Users.findOneAndUpdate(
      { _id: userId, "profile.education._id": idSchool }, // Điều kiện tìm kiếm
      {
        $set: {
          "profile.education.$.school": school,
          "profile.education.$.degree": degree,
          "profile.education.$.fieldOfStudy": fieldOfStudy,
          "profile.education.$.startDate": startDateString,
          "profile.education.$.endDate": endDateString,
        },
      },
      { new: true } // Trả về dữ liệu mới sau khi cập nhật
    );

    if (!user) {
      return res.status(404).json({ message: "User or work entry not found" });
    }

    res.json({ message: "Update successful", status: 200, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const DeleteWorkId = async (req, res) => {
  try {
    let { id } = req.params;
    let { workId } = req.body;
    console.log("xxx", workId);

    const user = await Users.findByIdAndUpdate(
      id,
      { $pull: { "profile.work": { _id: workId } } }, // Xóa công việc có ID tương ứng
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    }

    return res
      .status(200)
      .json({ message: "Đã xóa công việc thành công!", user });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error });
  }
};

const DeleteEducationkId = async (req, res) => {
  try {
    let { id } = req.params;
    let { educationId } = req.body;

    const user = await Users.findByIdAndUpdate(
      id,
      { $pull: { "profile.education": { _id: educationId } } }, // Xóa công việc có ID tương ứng
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    }

    return res
      .status(200)
      .json({ message: "Đã xóa công việc thành công!", user });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error });
  }
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
  getProfileUser,
  updateIntroduce,
  UpdateWorkByConditions,
  APICreateWorkUser,
  createEducationAPI,
  DeleteWorkId,
  DeleteEducationkId,
  UpdateEducation,
};
