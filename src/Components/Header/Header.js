import "./Header.scss";
import { FaSearch, FaFacebookMessenger } from "react-icons/fa";
import { CiHome } from "react-icons/ci";
import { PiMonitorPlayLight } from "react-icons/pi";
import { MdGroupWork } from "react-icons/md";
import { RiPlayListAddFill } from "react-icons/ri";
import { BsShop } from "react-icons/bs";
import { IoMdMenu, IoIosNotifications, IoMdContact } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import Logo from "./../../asset/images/logo-vantc-1679219983.jpg";
import { getAllMessAPI } from "./../../service/apiAxios";

import BoxMessages from "../BoxMessages/BoxMessages";
const Header = ({
  status,
  username,
  HandleTogleBtn,
  isDarkMode,
  fetchSeenUserData,
}) => {
  let navigate = useNavigate();
  const hiddenModel = useRef();
  const [isModel, setModel] = useState(false);
  const [data, setData] = useState([]);
  const [showBox, setShowBox] = useState(false);
  const avatar = localStorage.getItem("avatar");

  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("id");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");

    toast.success("Đăng xuất thành công");
    navigate("/login");
  };
  const receiverId = localStorage.getItem("id");

  const handleHidenModel = () => {
    setModel(!isModel);
  };

  const getAllMess = async () => {
    try {
      let res = await getAllMessAPI(receiverId);
      if (res && res.data && res.data.data) {
        setData(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllMess();
  }, []);

  const handleClickOutside = (event) => {
    if (hiddenModel.current && !hiddenModel.current.contains(event.target)) {
      setModel(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleShowBoxMess = () => {
    setShowBox(!showBox);
  };
  return (
    <div className="Header flex w-full items-center">
      <div className="w-80 flex items-center gap-5 -mt-2">
        <div className="icon-fb">
          <img src={Logo} alt="duyanh" className="size-10 fb_logo mt-2 ml-5" />
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
          <FaFacebookMessenger className="size-6" onClick={handleShowBoxMess} />
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
          {showBox && (
            <div className="mess_text ">
              <BoxMessages
                data={data}
                getAllMess={getAllMess}
                fetchSeenUserData={fetchSeenUserData}
                setShowBox={setShowBox}
              />
            </div>
          )}
        </div>
        <div className="border-icon">
          <IoIosNotifications className="size-6" />
          <div className="text">
            <span className="">Thông báo</span>
          </div>
        </div>

        {avatar ? (
          <img
            className="w-10 h-10 object-cover rounded-full "
            src={avatar}
            alt="ảnh lỗi"
            onClick={handleHidenModel}
          />
        ) : (
          <div className="border-icon" onClick={handleHidenModel}>
            <IoMdContact className="size-6" />
            <div className="text -ml-8">
              <span className="">Tài khoản</span>
            </div>
          </div>
        )}

        {isModel && (
          <div className="dropdown-content  " ref={hiddenModel}>
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
