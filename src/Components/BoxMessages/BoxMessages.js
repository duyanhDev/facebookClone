import { AiOutlineFullscreen } from "react-icons/ai";
import { FaLeaf, FaRegEdit, FaSearch } from "react-icons/fa";
import { IoEllipsisHorizontal } from "react-icons/io5";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button } from "antd";
import "./BoxMessage.scss";
import avtart from "./../../asset/images/2.png";
import { getMessagesBetweenUsers, pustSeenUser } from "../../service/apiAxios";
import Mess from "../Mess/Mess";

const BoxMessages = ({
  data,
  getAllMess,
  fetchSeenUserData,
  showBox,
  setShowBox,
}) => {
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [receiverId, setReceiverId] = useState("");
  const [messages, setMessage] = useState([]);
  const currentUserId = localStorage.getItem("id");
  const [check, setCheck] = useState(false);
  // Group messages by sender
  const groupedLastMessages = data.reduce((acc, mess) => {
    const sender = mess.senderId.profile.name;
    acc[sender] = mess;
    return acc;
  }, {});

  useEffect(() => {
    getAllMess();
  }, [data, getAllMess]);

  const handleClickChat = async (id) => {
    setReceiverId(id);
    setCheck(true);
    setShowBox(false);
    try {
      await pustSeenUser(id, currentUserId);
      await fetchSeenUserData();
      fetchAndSetMessages(id); // Fetch messages when the chat is opened
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

  const handleSearchToggle = () => {
    setIsSearchMode((prev) => !prev);
  };
  const getTimeAgoInMinutes = (postTime) => {
    const now = new Date(); // Current time
    const postDate = new Date(postTime); // Convert postTime to Date object

    const diffInMilliseconds = now - postDate;
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60)); // Convert milliseconds to minutes

    if (diffInMinutes === 0) {
      return "vừa xong";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`;
    } else if (diffInMinutes < 1440) {
      // Less than a day
      const diffInHours = Math.floor(diffInMinutes / 60);
      return `${diffInHours} giờ trước`;
    } else if (diffInMinutes < 10080) {
      // Less than a week (7 days)
      const diffInDays = Math.floor(diffInMinutes / 1440);
      return `${diffInDays} ngày trước`;
    } else {
      // More than a week
      const diffInWeeks = Math.floor(diffInMinutes / 10080);
      return `${diffInWeeks} tuần trước`;
    }
  };

  return (
    <>
      {showBox && (
        <div className={`${showBox}? mess_text : null`}>
          <div className="ml-3 font-bold flex justify-between items-center mt-3">
            <h1 className="text-xl">Đoạn chat</h1>
            <div className="flex gap-2 justify-between items-center">
              <IoEllipsisHorizontal className="text-xl" />
              <AiOutlineFullscreen className="text-xl" />
              <FaRegEdit className="text-xl" />
            </div>
          </div>

          <div className="flex items-center w-full mt-3">
            {isSearchMode ? (
              <>
                <ArrowLeftOutlined onClick={handleSearchToggle} />
                <div className="mx-3 flex items-center rounded-3xl bg-[#f0f2f5] w-5/6">
                  <input
                    type="text"
                    placeholder="Tìm kiếm trên Messenger"
                    className="w-full h-7 outline-none input-icon bg-transparent text-sm ml-2"
                  />
                </div>
              </>
            ) : (
              <div
                className="mx-3 flex items-center rounded-3xl bg-[#f0f2f5] mt-3"
                onClick={handleSearchToggle}
              >
                <FaSearch className="text-gray-500 ml-2" />
                <input
                  type="text"
                  placeholder="Tìm kiếm trên Messenger"
                  className="w-full h-7 outline-none input-icon bg-transparent text-sm ml-2"
                />
              </div>
            )}
          </div>

          <div className="flex items-center ml-4 mt-5 gap-3">
            <Button>Hộp Thư</Button>
            <Button>Cộng Đồng</Button>
          </div>

          {Object.keys(groupedLastMessages).map((sender, index) => {
            const message = groupedLastMessages[sender];
            return (
              <div
                key={index}
                className="flex items-center gap-2 mt-4 ml-3"
                onClick={() => handleClickChat(message.senderId._id)}
              >
                <img
                  className="w-12 h-12 rounded-full object-cover"
                  src={message.senderId.profile.avatar || avtart}
                  alt="avatar"
                />
                <div className="flex-grow">
                  <p className="text-sm font-bold">{sender}</p>
                  <p
                    className={`text-sm ${
                      message.seen ? "" : "font-bold text-[#333]"
                    }`}
                  >
                    {`${message.content} ${getTimeAgoInMinutes(
                      message.updatedAt
                    )}`}
                  </p>
                </div>

                {!message.seen && <div className="blue-rounder"></div>}
              </div>
            );
          })}
        </div>
      )}
      {/* Message Component */}
      {receiverId && (
        <div className="message1">
          <Mess
            mess={messages}
            currentUserId={currentUserId}
            fetchAndSetMessages={fetchAndSetMessages}
            check={check} // If there are messages, set check to true
            setCheck={setCheck}
            receiverId={receiverId}
          />
        </div>
      )}
    </>
  );
};

export default BoxMessages;
