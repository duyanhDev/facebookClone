import axios from "./../untils/axios";
// list Users
const getUser = async () => {
  try {
    const response = await axios.get("http://localhost:8001/v1/v1/api/users");
    return response.data; // Return the data directly
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};
// lấy danh sách kết bạn
const getAddUser = async (id) => {
  return axios.get(`http://localhost:8001/v1/api/addfriend/${id}`);
};

// xác nhận kết bạn (chấp nhận kb)

const putAddFriend = async (userId, friendId) => {
  try {
    return await axios.put(
      `http://localhost:8001/v1/api/addfriend/${userId}/${friendId}`
    );
  } catch (error) {
    console.log(error);
    return;
  }
};

// xem tin nhắn 1 vs 1
const getMessagesBetweenUsers = async (senderId, receiverId) => {
  try {
    const response = await axios.get(
      `http://localhost:8001/v1/api/message/${senderId}/${receiverId}`
    );
    return response; // Trả về dữ liệu từ response
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};
// xem all tin nhắn
const getAllMessAPI = async (receiverId) => {
  return await axios.get(
    `http://localhost:8001/v1/api/allmessage/${receiverId}`
  );
};
// gửi tin nhắn
const postMessages = async (senderId, receiverId, content) => {
  const data = new FormData();
  data.append("senderId", senderId);
  data.append("receiverId", receiverId);
  data.append("content", content);
  data.append("seen", false);

  return await axios.post("http://localhost:8001/v1/api/message", data);
};

const getSeenUser = async (receiverId) => {
  return await axios.get(`http://localhost:8001/v1/api/message/${receiverId}`);
};

// status seen

const pustSeenUser = async (senderId, receiverId) => {
  return await axios.put(
    `http://localhost:8001/v1/api/message/${senderId}/${receiverId}`
  );
};

const getBestfriend = async (id) => {
  return await axios.get(`http://localhost:8001/v1/api/users/${id}`);
};

// đăng kí user
const postRegisterUser = async (email, username, password, name, avatar) => {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("username", username);
  formData.append("password", password);
  formData.append("name", name); // Append name directly, not as profile.name
  formData.append("avatar", avatar);
  return await axios.post(`http://localhost:8001/v1/api/users`, formData);
};

// đăng nhập

const postLoginUser = async (email, password) => {
  try {
    const response = await axios.post("http://localhost:8001/v1/api/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      // Lỗi từ phía server
      return { error: error.response.data.message || "Something went wrong" };
    } else if (error.request) {
      // Không nhận được phản hồi từ server
      return { error: "No response from server" };
    } else {
      // Lỗi khi cấu hình yêu cầu
      return { error: error.message };
    }
  }
};

// const postLogOut = async (refresh_token) => {
//   return await axios.post("http://localhost:8001/v1/api/refresh-token", {
//     refresh_token,
//   });
// };
const postLogOut = async (userId) => {
  return await axios.post(`http://localhost:8001/v1/api/logout/${userId}`);
};
//POST
// bài post
const PostCreateNew = async (
  authorId,
  content,
  image,
  video,
  taggedFriends
) => {
  const data = new FormData();
  data.append("authorId", authorId);
  data.append("content", content);
  data.append("image", image);
  data.append("video", video || null);
  data.append("taggedFriend", taggedFriends || JSON.stringify([]));

  return await axios.post("http://localhost:8001/v1/api/post", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const getPostNewUsers = async () => {
  return await axios.get("http://localhost:8001/v1/api/post");
};

// like
const fetchLikesFromApi = async (postId) => {
  try {
    const response = await axios.get(
      `http://localhost:8001/v1/api/like/${postId}`
    );
    return response.data; // This should be an array of likes
  } catch (error) {
    throw error;
  }
};

// thêm like
const postLikeFromAPI = async (_id, authorId, userId, reaction) => {
  const data = {
    _id,
    authorId,
    like: {
      userId: userId,
      reaction: reaction,
    },
  };
  return await axios.post("http://localhost:8001/v1/api/like", data);
};

/// tính năng bình luận

const getCommentsAPI = async () => {
  try {
    return await axios.get("http://localhost:8001/v1/api/comment");
  } catch (error) {
    console.log(error);
    return;
  }
};

const CreateCommentsAPI = async (
  postId,
  authorId,
  content,
  image,
  replies = []
) => {
  const data = new FormData();
  data.append("postId", postId);
  data.append("authorId", authorId);
  data.append("content", content);
  data.append("image", image);

  // Kiểm tra nếu replies là một mảng và append từng phần tử
  if (Array.isArray(replies)) {
    replies.forEach((reply) => {
      data.append("replies[]", reply); // Sử dụng 'replies[]' để chỉ định mảng
    });
  }

  return await axios.post("http://localhost:8001/v1/api/comment", data);
};

const CreatefeedbackComment = async (
  postId,
  authorId,
  content,
  image,
  replies = [],
  receiverId,
  senderId
) => {
  const data = new FormData();
  data.append("postId", postId);
  data.append("authorId", authorId);
  data.append("content", content);
  data.append("image", image);

  // Kiểm tra nếu replies là một mảng và append từng phần tử
  if (Array.isArray(replies)) {
    replies.forEach((reply) => {
      data.append("replies[]", reply); // Sử dụng 'replies[]' để chỉ định mảng
    });
  }
  data.append("receiverId", receiverId);
  data.append("senderId", senderId);
  return await axios.post("http://localhost:8001/v1/api/feedbackComment", data);
};

// thêm like comment

const postCommentLikes = async (_id, authorId, userId, reaction) => {
  const data = {
    _id,
    authorId,
    like: {
      userId: userId,
      reaction: reaction,
    },
  };
  return await axios.post("http://localhost:8001/v1/api/likecomment", data);
};

// get like comment
const fetchLikesCommentFromApi = async (postId) => {
  try {
    const response = await axios.get(
      `http://localhost:8001/v1/api/likeComment/${postId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getCountComments = async (postIdArray) => {
  return await axios.get(`http://localhost:8001/v1/api/comentCount`, {
    params: {
      postId: postIdArray, // Gửi mảng postId
    },
  });
};

// thông báo
const getNotificationsAPI = async (userId) => {
  return await axios.get(`http://localhost:8001/v1/api/nocatifition/${userId}`);
};
// đếm thông báo
const getCountNotifications = async (userId) => {
  return await axios.get(
    `http://localhost:8001/v1/api/nocatifitionCount/${userId}`
  );
};

export {
  getUser,
  getAddUser,
  putAddFriend,
  getMessagesBetweenUsers,
  getAllMessAPI,
  postMessages,
  getSeenUser,
  getBestfriend,
  postLoginUser,
  postLogOut,
  pustSeenUser,
  PostCreateNew,
  getPostNewUsers,
  fetchLikesFromApi,
  postLikeFromAPI,
  postRegisterUser,
  getCommentsAPI,
  CreateCommentsAPI,
  CreatefeedbackComment,
  postCommentLikes,
  fetchLikesCommentFromApi,
  getCountComments,
  getNotificationsAPI,
  getCountNotifications,
};
