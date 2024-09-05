const Users = require("./../model/users");

const getReadUser = async () => {
  try {
    let result = await Users.find({});
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const postCreateUser = async (data) => {
  try {
    let result = await Users.create(data);
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = {
  getReadUser,
  postCreateUser,
};
