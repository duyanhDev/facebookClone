import "./Header.scss";
import { FaFacebook, FaSearch, FaFacebookMessenger } from "react-icons/fa";
import { CiHome } from "react-icons/ci";
import { PiMonitorPlayLight } from "react-icons/pi";
import { MdGroupWork } from "react-icons/md";
import { RiPlayListAddFill } from "react-icons/ri";
import { BsShop } from "react-icons/bs";
import { IoMdMenu, IoIosNotifications, IoMdContact } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";

const Header = ({ status, username, HandleTogleBtn, isDarkMode }) => {
  let navigate = useNavigate();
  const [isModel, setModel] = useState(false);
  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("id");
    localStorage.removeItem("refreshToken");

    toast.success("Đăng xuất thành công");
    navigate("/login");
  };

  const handleHidenModel = () => {
    setModel(!isModel);
  };
  return (
    <div className="Header flex w-full items-center">
      <div className="w-80 flex items-center gap-5 -mt-2">
        <div className="icon-fb">
          <FaFacebook className="size-8 fb_logo" />
        </div>
        <div className="Input mt-2 relatives w-full flex items-center">
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
              <CiHome
                className={`${
                  isDarkMode ? "text-[#fff]" : "text-[#333]"
                } size-8`}
              />
            </Link>
            <div className="text">
              <span className="">Trang chủ</span>
            </div>
          </li>
          <li>
            <Link>
              <PiMonitorPlayLight
                className={`${
                  isDarkMode ? "text-[#fff]" : "text-[#333]"
                } size-8`}
              />
            </Link>
            <div className="text">
              <span className="">Video</span>
            </div>
          </li>
          <li>
            <Link>
              <BsShop
                className={`${
                  isDarkMode ? "text-[#fff]" : "text-[#333]"
                } size-8`}
              />
            </Link>
            <div className="text">
              <span className="">Marketplace</span>
            </div>
          </li>
          <li>
            <Link>
              <MdGroupWork
                className={`${
                  isDarkMode ? "text-[#fff]" : "text-[#333]"
                } size-8`}
              />
            </Link>
            <div className="text">
              <span className="">Nhóm</span>
            </div>
          </li>
          <li>
            <Link>
              <RiPlayListAddFill
                className={`${
                  isDarkMode ? "text-[#fff]" : "text-[#333]"
                } size-8`}
              />
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
        <div className="border-icon" onClick={handleHidenModel}>
          <IoMdContact className="size-6" />
          <div className="text -ml-8">
            <span className="">Tài khoản</span>
          </div>
        </div>
        {isModel && (
          <div className="dropdown-content  ">
            <ul className="p-8">
              <li>
                <a href="/profile">Thông tin cá nhân</a>
              </li>
              <li>
                <a href="/settings">Cài đặt</a>
              </li>
              <li>
                <span onClick={() => handleLogOut()}>Đăng xuất</span>
              </li>
              <li>
                <span onClick={() => HandleTogleBtn()}>
                  {isDarkMode ? "Chế độ sáng" : "Chế độ tối"}
                </span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
