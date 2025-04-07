import { useState, useEffect, useRef } from "react";
import { IoSend, IoImage } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { BsCircleFill } from "react-icons/bs";
import { postMessages, pustSeenUser } from "../../service/apiAxios";
import defaultAvatar from "./../../asset/images/2.png";
import "./Mess.scss";

const Mess = ({
  mess,
  currentUserId,
  fetchAndSetMessages,
  check,
  setCheck,
  receiverId,
}) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const handlePostMess = async () => {
    try {
      if (text.trim() || image) {
        if (image) {
          const formData = new FormData();
          formData.append("senderId", currentUserId);
          formData.append("receiverId", receiverId);
          if (text.trim()) {
            formData.append("content", text);
          }
          formData.append("image", image);

          let data = await postMessages(currentUserId, receiverId, text, image);
          if (data) {
            setText("");
            setImage(null);
            setImagePreview(null);
            fetchAndSetMessages();
          }
        } else {
          let data = await postMessages(currentUserId, receiverId, text);
          if (data) {
            setText("");
            fetchAndSetMessages();
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handlePostMess();
    }
  };

  const closeChat = () => {
    setCheck(false);
  };

  // Get recipient name
  const recipientName =
    mess.length > 0
      ? mess[0].senderId._id === currentUserId
        ? mess[0]?.receiverId.profile.name
        : mess[0]?.senderId.profile.name
      : "";

  // Get recipient avatar
  const recipientAvatar =
    mess.length > 0
      ? mess[0].senderId._id === currentUserId
        ? mess[0]?.receiverId.profile.avatar || defaultAvatar
        : mess[0]?.senderId.profile.avatar || defaultAvatar
      : defaultAvatar;

  useEffect(() => {
    fetchAndSetMessages();
    // scrollToBottom();
  }, [handlePostMess]);

  // useEffect(() => {
  //   scrollToBottom();
  // }, [mess]);

  // const scrollToBottom = () => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // };

  const handleInputClick = async () => {
    try {
      await pustSeenUser(receiverId, currentUserId);
    } catch (error) {
      console.error("Error updating seen user data:", error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const openFileSelector = () => {
    fileInputRef.current.click();
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Format timestamp
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      {check && (
        <div className="chat-container">
          {/* Chat toggle button */}
          <button className="chat-toggle-btn">
            <svg
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path>
            </svg>
          </button>

          {/* Chat window */}
          <div className="chat-window">
            {/* Header */}
            <div className="chat-header">
              <div className="chat-user-info">
                <div className="avatar-container">
                  <img
                    src={recipientAvatar}
                    alt="User Avatar"
                    className="user-avatar"
                  />
                  <span className="online-indicator">
                    <BsCircleFill />
                  </span>
                </div>
                <div className="user-details">
                  <h3>{recipientName}</h3>
                  <span className="user-status">Online</span>
                </div>
              </div>
              <button className="close-btn" onClick={closeChat}>
                <MdClose />
              </button>
            </div>

            {/* Messages area */}
            <div className="messages-container">
              {mess.length > 0 ? (
                mess.map((item, index) => {
                  const isSender = item.senderId._id === currentUserId;
                  const messageTime = formatMessageTime(item.createdAt);

                  return (
                    <div
                      key={index}
                      className={`message-wrapper ${
                        isSender ? "sender" : "receiver"
                      }`}
                    >
                      {!isSender && (
                        <div className="message-avatar">
                          <img
                            src={item.senderId.profile.avatar || defaultAvatar}
                            alt="Avatar"
                          />
                        </div>
                      )}
                      <div className="message-bubble-container">
                        <div className="message-bubble">
                          {item.content && (
                            <p className="message-text">{item.content}</p>
                          )}
                          {item.image && item.image.length > 0 && (
                            <div className="message-image-container">
                              <img
                                src={item.image}
                                alt="Message attachment"
                                className="message-image"
                              />
                            </div>
                          )}
                        </div>
                        <span className="message-time">{messageTime}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="no-messages">
                  <p>No messages yet. Start a conversation!</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Image preview */}
            {imagePreview && (
              <div className="image-preview-container">
                <div className="image-preview">
                  <img src={imagePreview} alt="Selected" />
                  <button className="remove-image-btn" onClick={removeImage}>
                    <MdClose />
                  </button>
                </div>
              </div>
            )}

            {/* Input area */}
            <div className="input-container">
              <div className="input-wrapper">
                <textarea
                  placeholder="Type a message..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onClick={handleInputClick}
                  onKeyDown={handleEnter}
                  className="message-input"
                  rows={1}
                />
                <div className="input-actions">
                  <button
                    className="action-btn image-btn"
                    onClick={openFileSelector}
                    title="Add image"
                  >
                    <IoImage />
                  </button>
                  <button
                    className="action-btn send-btn"
                    onClick={handlePostMess}
                    disabled={!text.trim() && !image}
                    title="Send message"
                  >
                    <IoSend />
                  </button>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  style={{ display: "none" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Mess;
