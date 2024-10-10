import { GoDotFill } from "react-icons/go";
import "./Mess.scss";
import { useEffect, useState } from "react";
import { postMessages, pustSeenUser } from "../../service/apiAxios";
import avtart from "./../../asset/images/2.png";
const Mess = ({
  mess,
  currentUserId,
  fetchAndSetMessages,
  check,
  setCheck,
  receiverId,
}) => {
  const [text, setText] = useState("");

  const handlePostMess = async () => {
    try {
      let data = await postMessages(currentUserId, receiverId, text);
      if (data) {
        setText("");
        fetchAndSetMessages();
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  const handleEnter = (e) => {
    if (e.key === "Enter") {
      handlePostMess();
    }
  };
  // Hàm ẩn chat
  const handleCheckHiden = () => {
    setCheck(false);
  };

  // Lấy tên để hiển thị trong tiêu đề chat
  const chatHeaderName =
    mess.length > 0
      ? mess[0].senderId._id === currentUserId
        ? mess[0]?.receiverId.profile.name
        : mess[0]?.senderId.profile.name
      : "";

  useEffect(() => {
    fetchAndSetMessages();
  }, [handlePostMess]);

  const handleInputClick = async () => {
    try {
      await pustSeenUser(receiverId, currentUserId);
    } catch (error) {
      console.error("Error updating seen user data:", error);
    }
  };

  return (
    <>
      {check && (
        <div className="chat_mess">
          <div>
            <button
              aria-expanded="false"
              aria-haspopup="dialog"
              className="fixed bottom-8 right-4 inline-flex items-center justify-center text-sm font-medium disabled:pointer-events-none disabled:opacity-50 border rounded-full w-16 h-16 bg-black hover:bg-gray-700 m-0 cursor-pointer border-gray-200 bg-none p-0 normal-case leading-5 hover:text-gray-900"
              data-state="closed"
              type="button"
            >
              <svg
                className="text-white block border-gray-200 align-middle"
                fill="none"
                height="40"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="30"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  className="border-gray-200"
                  d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"
                ></path>
              </svg>
            </button>
            <div
              className="fixed -bottom-0 right-20 bg-white p-4 rounded-lg border border-[#e5e7eb] w-[320px] h-[400px] flex flex-col"
              style={{
                boxShadow:
                  "0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0 0 0 / 0.05)",
              }}
            >
              <div
                onClick={() => handleCheckHiden()}
                className="flex flex-col space-y-1.5 pb-4"
              >
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold text-lg tracking-tight">
                    {chatHeaderName}
                  </h2>
                  <span className="text-blue-700 cursor-pointer">X</span>
                </div>

                <div className="flex items-center">
                  <GoDotFill className="text-green-500" />
                  <p className="text-sm text-[#6b7280] leading-3">
                    Đang hoạt động
                  </p>
                </div>
              </div>
              <div
                className="flex-1 overflow-y-auto"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  minWidth: "100%",
                  marginBottom: "4rem", // Ensure space for the input and send button
                }}
              >
                {mess.length > 0 && (
                  <div className="mess-container">
                    {mess.map((item, index) => (
                      <div
                        key={index}
                        className={`message ${
                          item.senderId._id === currentUserId
                            ? "message-sent"
                            : "message-received"
                        }`}
                      >
                        <div className="message-avatar">
                          <img
                            src={
                              item.senderId.profile.avatar
                                ? item.senderId.profile.avatar
                                : avtart
                            }
                            alt={`${item.senderId.profile.name}'s avatar`}
                          />
                        </div>
                        <div className="message-content">
                          <p>{item.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div
                className="absolute bottom-0 left-0 w-full p-2"
                style={{
                  backgroundColor: "white",
                }}
              >
                <div className="flex items-center w-full space-x-2">
                  <input
                    className="flex-1 h-10 rounded-md border border-[#e5e7eb] px-3 py-2 text-sm placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-50 text-[#030712] focus-visible:ring-offset-2"
                    placeholder="Type your message"
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onClick={() => handleInputClick()}
                    onKeyDown={handleEnter}
                  />
                  <button
                    onClick={() => handlePostMess()}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium text-[#f9fafb] disabled:pointer-events-none disabled:opacity-50 bg-black hover:bg-[#111827E6] h-10 px-4 py-2"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Mess;
