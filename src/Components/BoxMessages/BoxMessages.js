import { AiOutlineFullscreen } from "react-icons/ai";
import { FaRegEdit } from "react-icons/fa";
import { IoEllipsisHorizontal } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button } from "antd";
import "./BoxMessage.scss";
import lin from "./../../asset/images/linjpg.jpg";
const BoxMessages = ({ data, getAllMess }) => {
  const [isChange, setIsChange] = useState(false);
  const handleOnChange = () => {
    setIsChange(true);
  };
  const handleOnChangePrve = () => {
    setIsChange(false);
  };

  const groupedLastMessages = data.reduce((acc, mess) => {
    const sender = mess.senderId.profile.name;
    acc[sender] = mess;

    console.log(acc);

    return acc;
  }, {});
  useEffect(() => {
    getAllMess();
  }, [data]);
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
      {isChange ? (
        <div className="flex items-center w-full mt-3">
          <ArrowLeftOutlined onClick={handleOnChangePrve} />
          <div className="mx-3 flex items-center rounded-3xl bg-[#f0f2f5] w-5/6">
            <input
              type="text"
              placeholder="Tìm kiếm trên Messenger"
              className="w-full h-7 outline-none input-icon bg-transparent text-sm ml-2 "
            />
          </div>
        </div>
      ) : (
        <div className="mx-3 flex items-center rounded-3xl bg-[#f0f2f5]  mt-3">
          <FaSearch className="text-gray-500 ml-2" />
          <input
            type="text"
            placeholder="Tìm kiếm trên Messenger"
            className="w-full h-7 outline-none input-icon bg-transparent text-sm ml-2"
            onClick={handleOnChange}
          />
        </div>
      )}

      <div className="flex items-center ml-4 mt-5 gap-3">
        <Button>Hộp Thư</Button>
        <Button>Cộng Đồng</Button>
      </div>
      {Object.keys(groupedLastMessages).map((sender, index) => (
        <div key={index} className="flex items-center gap-4 mt-4 ml-3">
          <div>
            <img
              className="w-12 h-12 rounded-full object-cover"
              src={
                groupedLastMessages[sender].senderId.profile.avatar
                  ? groupedLastMessages[sender].senderId.profile.avatar
                  : lin
              }
              alt="avatar"
            />
          </div>
          <div className="flex-grow">
            <p className="text-sm font-bold">{sender}</p>
            {groupedLastMessages[sender].seen ? (
              <p className="text-sm">{groupedLastMessages[sender].content}</p>
            ) : (
              <p className="text-sm text-[#333] font-bold">
                {groupedLastMessages[sender].content}
              </p>
            )}
          </div>
          {!groupedLastMessages[sender].seen && (
            <div className="blue-rounder"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BoxMessages;
