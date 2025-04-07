import "./SiderRight.scss";
import avtar3 from "./../../asset/images/457581765_6650019743920_7145976287699803331_n.jpg";
import icon1 from "./../../asset/images/1.png";
import lin from "./../../asset/images/linjpg.jpg";
import { CiGift } from "react-icons/ci";
import { useEffect, useState, useRef, useCallback } from "react";
import { FaSearch } from "react-icons/fa";
import {
  IoEllipsisHorizontal,
  IoReloadCircleSharp,
  IoResizeOutline,
} from "react-icons/io5";
import { TbSpeakerphone } from "react-icons/tb";
import Mess from "../Mess/Mess";
import {
  getMessagesBetweenUsers,
  pustSeenUser,
  putAddFriend,
} from "../../service/apiAxios";
import avtart from "./../../asset/images/2.png";

const SiderRight = ({
  add,
  friend,
  fetchSeenUserData,
  idFriend,
  fetchAddUserData,
  isDarkMode,
}) => {
  const [active, setActive] = useState(false);
  const [model, SetModel] = useState(false);
  const modalRef = useRef(null);
  const [receiverId, setReceverid] = useState("");
  const [mess, setMessage] = useState("");
  const currentUserId = localStorage.getItem("id");
  const [check, setCheck] = useState(false);

  const handleClickChat = async (id) => {
    setReceverid(id);
    setCheck(true);
    try {
      await pustSeenUser(id, currentUserId);
      await fetchSeenUserData();
    } catch (error) {
      console.error("Failed to update seen user:", error);
    }
  };

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

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setActive(false);
    }
  };

  const handleCick = () => {
    setActive(!active);
  };
  const handleHidenModel = () => {
    SetModel(!model);
    setActive(!active);
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const HadlePutFriend = async () => {
    let res = await putAddFriend(currentUserId, idFriend);
    console.log("check", res);
    if (res && res.data) {
    }
  };

  const Friends =
    add.length > 0 ? add.map((friend) => friend.friendId.profile) : [];

  const firstName = Friends.length > 0 ? Friends[0].name : null;
  const avart = Friends.length > 0 ? Friends[0].avatar : "";

  return (
    <>
      <div className="main-right w-80 h-screen fixed right-0 bg-white transition-colors duration-500 p-4 overflow-y-auto">
        {/* Được tài trợ */}

        {/* Lời mời kết bạn */}
        <div className="add_friend mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
              Lời mời kết bạn
            </h3>
            <span className="text-blue-500 cursor-pointer hover:underline">
              Xem tất cả
            </span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/30 backdrop-blur-md border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <img
              className="w-12 h-12 object-cover rounded-full shadow-sm transform hover:scale-110 transition-all duration-300"
              src={avart}
              alt="ảnh kết bạn bị lỗi"
            />
            <div className="flex-1">
              <span className="text-gray-800 font-medium truncate">
                {firstName}
              </span>
              <div className="flex items-center mt-1">
                <img className="w-5 h-5 rounded-full" src={lin} alt="lỗi" />
                <span className="ml-2 text-gray-600 text-sm">2 bạn chung</span>
              </div>
            </div>
          </div>
          <div className="btn_adds flex space-x-3 mt-3">
            <button
              type="button"
              className="flex-1 text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 focus:ring-4 focus:outline-none focus:ring-blue-200 font-medium rounded-lg text-sm px-4 py-2 transition-all duration-300 shadow-md hover:shadow-lg"
              onClick={() => HadlePutFriend()}
            >
              Xác Nhận
            </button>
            <button
              type="button"
              className="flex-1 text-gray-800 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 focus:ring-4 focus:outline-none focus:ring-gray-200 font-medium rounded-lg text-sm px-4 py-2 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Xóa
            </button>
          </div>
        </div>

        {/* Sinh nhật */}
        <div className="add_friend mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
              Sinh nhật
            </h3>
            <span className="text-blue-500 cursor-pointer hover:underline">
              Xem tất cả
            </span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/30 backdrop-blur-md border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CiGift className="size-8 text-blue-500 hover:rotate-12 transition-all duration-300" />
            <h3 className="text-gray-800">
              Hôm nay là sinh nhật của Duy Anh và 2 người khác.
            </h3>
          </div>
        </div>

        {/* Người liên hệ */}
        <div className="add_friend">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
              Người liên hệ
            </h3>
            <div className="flex items-center gap-4">
              <FaSearch className="text-gray-600 cursor-pointer hover:text-blue-500 hover:scale-110 transition-all duration-300" />
              <IoEllipsisHorizontal className="text-gray-600 cursor-pointer hover:text-blue-500 hover:rotate-90 transition-all duration-300" />
            </div>
          </div>
          <div className="contacts-list max-h-80 overflow-y-auto space-y-2">
            {friend && friend.length > 0 ? (
              friend.map((item) => (
                <div
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/30 backdrop-blur-md border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                  key={item._id}
                  onClick={() => handleClickChat(item._id)}
                >
                  <span className="relative">
                    <img
                      className="w-10 h-10 object-cover rounded-full shadow-sm transform hover:scale-110 transition-all duration-300"
                      src={item.profile.avatar ? item.profile.avatar : avtart}
                      alt="lỗi"
                    />
                    <span className="absolute bottom-0 right-0 w-5 h-5 bg-gradient-to-r from-green-400 to-green-600 rounded-full border-2 border-white shadow-sm"></span>
                  </span>
                  <span className="text-gray-800 font-medium truncate w-40">
                    {item.profile.name}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-sm p-3">
                Không có người liên hệ.
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="message">
        <Mess
          mess={mess}
          currentUserId={currentUserId}
          fetchAndSetMessages={fetchAndSetMessages}
          handleClickChat={handleClickChat}
          check={check}
          setCheck={setCheck}
          receiverId={receiverId}
          fetchSeenUserData={fetchSeenUserData}
          pustSeenUser={pustSeenUser}
        />
      </div>
    </>
  );
};

export default SiderRight;
