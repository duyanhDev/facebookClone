import { AiOutlineFullscreen } from "react-icons/ai";
import { FaRegEdit } from "react-icons/fa";
import { IoEllipsisHorizontal } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { useState } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import "./BoxMessage.scss";
const BoxMessages = () => {
  const [isChange, setIsChange] = useState(false);
  const handleOnChange = () => {
    setIsChange(true);
  };
  const handleOnChangePrve = () => {
    setIsChange(false);
  };
  return (
    <div>
      <div className="ml-3 font-bold flex justify-between items-center">
        <h1>Đoạn chat</h1>
        <div className="flex gap-2 justify-between items-center">
          <IoEllipsisHorizontal />
          <AiOutlineFullscreen />
          <FaRegEdit />
        </div>
      </div>
      {isChange ? (
        <div className="flex items-center w-full">
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
        <div className="mx-3 flex items-center rounded-3xl bg-[#f0f2f5] ">
          <FaSearch className="text-gray-500 ml-2" />
          <input
            type="text"
            placeholder="Tìm kiếm trên Messenger"
            className="w-full h-7 outline-none input-icon bg-transparent text-sm ml-2"
            onClick={handleOnChange}
          />
        </div>
      )}
    </div>
  );
};

export default BoxMessages;
