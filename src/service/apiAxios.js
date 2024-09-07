import axios from "./../untils/axios";

const getUser = async () => {
  try {
    const response = await axios.get("/v1/api/users");
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

const getBestfriend = async (id) => {
  return await axios.get(`http://localhost:8001/v1/api/users/${id}`);
};
export {
  getUser,
  getAddUser,
  getMessagesBetweenUsers,
  postMessages,
  getSeenUser,
  getBestfriend,
};
