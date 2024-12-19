const Stories = require("./../model/stories");

const CreateStories = async (storiesData) => {
  try {
    const data = await Stories.create(storiesData);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const GetAllStories = async () => {
  try {
    let data = await Stories.find({});
    return data;
  } catch (error) {
    console.log(error);
  }
};
module.exports = { CreateStories, GetAllStories };
