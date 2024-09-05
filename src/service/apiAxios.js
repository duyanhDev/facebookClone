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

const getAddUser = async (id) => {
  return axios.get(`http://localhost:8001/v1/api/addfriend/${id}`);
};

export { getUser, getAddUser };
