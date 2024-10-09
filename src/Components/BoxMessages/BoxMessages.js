import { AiOutlineFullscreen } from "react-icons/ai";
import { FaRegEdit, FaSearch } from "react-icons/fa";
import { IoEllipsisHorizontal } from "react-icons/io5";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button } from "antd";
import "./BoxMessage.scss";
import lin from "./../../asset/images/linjpg.jpg";
import { getMessagesBetweenUsers, pustSeenUser } from "../../service/apiAxios";
import Mess from "../Mess/Mess";

const BoxMessages = ({ data, getAllMess, fetchSeenUserData }) => {
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [receiverId, setReceiverId] = useState("");
  const [messages, setMessage] = useState([]); // Changed to an array for message storage
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

  return (
    <div>
      <div className="ml-3 font-bold flex justify-between items-center mt-3">
        <h1 className="text-xl">Đoạn chat</h1>
        <div className="flex gap-2 justify-between items-center">
          <IoEllipsisHorizontal className="text-xl" />
          <AiOutlineFullscreen className="text-xl" />
          <FaRegEdit className="text-xl" />
        </div>
      </div>

      {/* Search Input */}
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

      {/* List of Last Messages */}
      {Object.keys(groupedLastMessages).map((sender, index) => {
        const message = groupedLastMessages[sender];
        return (
          <div
            key={index}
            className="flex items-center gap-4 mt-4 ml-3"
            onClick={() => handleClickChat(message.senderId._id)}
          >
            <img
              className="w-12 h-12 rounded-full object-cover"
              src={message.senderId.profile.avatar || lin}
              alt="avatar"
            />
            <div className="flex-grow">
              <p className="text-sm font-bold">{sender}</p>
              <p
                className={`text-sm ${
                  message.seen ? "" : "font-bold text-[#333]"
                }`}
              >
                {message.content}
              </p>
            </div>
            {!message.seen && <div className="blue-rounder"></div>}
          </div>
        );
      })}

      {/* Message Component */}
      {receiverId && (
        <div className="message">
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
    </div>
  );
};

export default BoxMessages;
