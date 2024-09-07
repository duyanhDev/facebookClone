import "./Header.scss";
import { FaFacebook, FaSearch, FaFacebookMessenger } from "react-icons/fa";
import { CiHome } from "react-icons/ci";
import { PiMonitorPlayLight } from "react-icons/pi";
import { MdGroupWork } from "react-icons/md";
import { RiPlayListAddFill } from "react-icons/ri";
import { BsShop } from "react-icons/bs";
import { IoMdMenu, IoIosNotifications, IoMdContact } from "react-icons/io";
import { Link } from "react-router-dom";
import Mess from "../Mess/Mess";
import { getMessagesBetweenUsers } from "../../service/apiAxios";
import { useEffect, useState } from "react";

const Header = ({ status }) => {
  const [mess, setMessage] = useState("");
  const currentUserId = "66dc0fb26c16f18c8eee0e0b";
  useEffect(() => {
    fetchAndSetMessages();
  }, []);

  const fetchAndSetMessages = async () => {
    try {
      let response = await getMessagesBetweenUsers(
        "66dc0fb26c16f18c8eee0e0b",
        "66dc0fd76c16f18c8eee0e0e"
      );
      if (response && response.data && response.data.data) {
        console.log("hh", response.data.data);

        setMessage(response.data.data);
      } else {
        console.error("No data received or data structure is incorrect");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  return (
    <div className="Header flex w-full items-center">
      <div className="w-80 flex items-center gap-5 -mt-2">
        <div className="icon-fb">
          <FaFacebook className="size-8 fb_logo" />
        </div>
        <div className="Input relatives w-full flex items-center">
          <div className="icon_search ml-3">
            <FaSearch />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm trên FaceBook"
            className="outline-none flex-none"
          />
        </div>
      </div>
      <div className="Tag flex justify-center items-center m-auto cursor-pointer">
        <ul className="flex items-center gap-x-16 justify-center h-full">
          <li className="border-bt">
            <Link>
              <CiHome className="size-8" />
            </Link>
            <div className="text">
              <span className="">Trang chủ</span>
            </div>
          </li>
          <li>
            <Link>
              <PiMonitorPlayLight className="size-8" />
            </Link>
            <div className="text">
              <span className="">Video</span>
            </div>
          </li>
          <li>
            <Link>
              <BsShop className="size-8" />
            </Link>
            <div className="text">
              <span className="">Marketplace</span>
            </div>
          </li>
          <li>
            <Link>
              <MdGroupWork className="size-8" />
            </Link>
            <div className="text">
              <span className="">Nhóm</span>
            </div>
          </li>
          <li>
            <Link>
              <RiPlayListAddFill className="size-8" />
            </Link>
            <div className="text">
              <span className="">Trò chơi</span>
            </div>
          </li>
        </ul>
      </div>
      <div className="mess flex justify-center items-center gap-4 cursor-pointer">
        <div className="border-icon">
          <IoMdMenu className="size-6" />
          <div className="text">
            <span className="">Menu</span>
          </div>
        </div>
        <div className="border-icon">
          <FaFacebookMessenger className="size-6" />
          <span
            className={
              status ? "count absolute flex items-center justify-center" : ""
            }
          >
            <span className="text-count text-center text-white">
              {status ? status : ""}
            </span>
          </span>
          <div className="text">
            <span className="">Messenger</span>
          </div>
        </div>
        <div className="border-icon">
          <IoIosNotifications className="size-6" />
          <div className="text">
            <span className="">Thông báo</span>
          </div>
        </div>
        <div className="border-icon">
          <IoMdContact className="size-6" />
          <div className="text -ml-8">
            <span className="">Tài khoản</span>
          </div>
        </div>
      </div>
      <div className="message">
        <Mess
          mess={mess}
          currentUserId={currentUserId}
          fetchAndSetMessages={fetchAndSetMessages}
        />
      </div>
    </div>
  );
};

export default Header;
