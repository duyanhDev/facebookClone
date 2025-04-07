import { useCallback, useEffect, useState } from "react";
import {
  getMessagesBetweenUsers,
  getProfileUserAPI,
} from "../../service/apiAxios";
import Mess from "../Mess/Mess";
export const FriendUser = () => {
  const [mess, setMessage] = useState("");
  const currentUserId = localStorage.getItem("id");
  const [receiverId, setReceverid] = useState("");
  const [Check, setCheck] = useState(false);
  const [profile, setProfile] = useState([]);
  const fetchAndSetMessages = useCallback(async () => {
    try {
      let response = await getMessagesBetweenUsers(currentUserId, receiverId);
      if (response && response.data && response.data.data) {
        setMessage(response.data.data);
      }
    } catch (error) {
      return null;
    }
  }, [currentUserId, receiverId]);

  const listProfileUser = async () => {
    try {
      let res = await getProfileUserAPI(currentUserId);
      if (res && res.data && res.data.EC === 0) {
        console.log(res.data.data.profile.introduce);
        setProfile(res.data.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    listProfileUser();
  }, [currentUserId]);

  const handleMessUser = (receiverId) => {
    setReceverid(receiverId);
    setCheck(true);
    fetchAndSetMessages();
  };

  return (
    <div className="h-screen flex bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Navigation Left */}

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-auto mt-5 p-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
            Danh sách bạn bè
          </h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
            {profile?.friends &&
              profile?.friends.map((friend) => (
                <div
                  key={friend._id}
                  className="relative bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center group"
                >
                  <img
                    src={friend.friendId.profile.avatar}
                    alt={friend.friendId.profile.name}
                    className="w-24 h-24 rounded-full mx-auto border-4 border-indigo-400 hover:scale-110 transition-transform duration-300"
                  />
                  <h2 className="text-gray-800 text-lg font-semibold text-center mt-4">
                    {friend.friendId.profile.name}
                  </h2>
                  {/* Overlay with buttons on hover */}
                  <div className="absolute inset-0 bg-gray-800 bg-opacity-80 rounded-xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      className="text-white font-medium bg-indigo-500 bg-opacity-90 px-4 py-2 rounded-lg mb-2 hover:bg-opacity-100 transition duration-200"
                      onClick={() => handleMessUser(friend.friendId._id)}
                    >
                      Nhắn tin
                    </button>
                    <button className="text-white font-medium bg-indigo-500 bg-opacity-90 px-4 py-2 rounded-lg hover:bg-opacity-100 transition duration-200">
                      Xem hồ sơ
                    </button>
                  </div>
                </div>
              ))}
          </div>

          <Mess
            mess={mess}
            check={Check}
            currentUserId={currentUserId}
            fetchAndSetMessages={fetchAndSetMessages}
            setCheck={setCheck}
            receiverId={receiverId}
          />
        </div>
      </div>
    </div>
  );
};
