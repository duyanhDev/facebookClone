import "./Header.scss";
import { FaSearch } from "react-icons/fa";
import { FaFacebookMessenger } from "react-icons/fa6";
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
import { getAllMessAPI, postLogOut } from "./../../service/apiAxios";

import BoxMessages from "../BoxMessages/BoxMessages";
import Nocatifion from "../Nocatifion/Nocatifion";
import SearchFriends from "../SearchFriends/SearchFriends";
import GoogleTranslate from "../GoogleTranslate/GoogleTranslate";
const Header = ({
  status,
  HandleTogleBtn,
  isDarkMode,
  fetchSeenUserData,
  countNotifications,
  dataNocatifion,
  searchTerm,
  setSearchTerm,
  friends,
  isLoading,
}) => {
  let navigate = useNavigate();
  const hiddenModel = useRef();
  const hiddenMes = useRef();
  const hidden = useRef();
  const hiddenNocatifion = useRef();
  const [isModel, setModel] = useState(false);
  const [data, setData] = useState([]);
  const [showBox, setShowBox] = useState(false);
  const avatar = localStorage.getItem("avatar");
  const [showNocatfion, setShowNocatfion] = useState(false);
  const [hiddenSearch, setHiddenSearch] = useState(false);
  const receiverId = localStorage.getItem("id");

  const handleLogOut = async () => {
    try {
      // Call the logout API
      const response = await postLogOut(receiverId);
      console.log(response);

      if (data) {
        // Clear local storage
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("id");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("role");
        localStorage.removeItem("isOnline");

        // Notify user of successful logout
        toast.success("Đăng xuất thành công");
        navigate("/login");
      } else {
        toast.error("Đăng xuất thất bại: " + data.message);
      }
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Đăng xuất thất bại do lỗi hệ thống");
    }
  };

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

  const handleCickOutSideMess = (event) => {
    if (hiddenMes.current && !hiddenMes.current.contains(event.target)) {
      setShowBox(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleCickOutSideMess);
    return () => {
      document.removeEventListener("mousedown", handleCickOutSideMess);
    };
  }, []);
  const handleShowBoxMess = () => {
    setShowBox(!showBox);
    setShowNocatfion(false);
  };

  const hanldeShowNocatifion = () => {
    setShowNocatfion(!showNocatfion);
    setShowBox(false);
  };

  const handleCickOutSideNocatifion = (e) => {
    if (
      hiddenNocatifion.current &&
      !hiddenNocatifion.current.contains(e.target)
    ) {
      setShowNocatfion(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleCickOutSideNocatifion);
    return () => {
      document.removeEventListener("mousedown", handleCickOutSideNocatifion);
    };
  }, []);

  const handleChangeSearch = (e) => {
    // Check if the click is outside the search element
    if (hidden.current && !hidden.current.contains(e.target)) {
      setHiddenSearch(false); // Hide search when clicked outside
    }
  };

  // Attach the event listener to the document
  useEffect(() => {
    document.addEventListener("mousedown", handleChangeSearch);
    return () => {
      document.removeEventListener("mousedown", handleChangeSearch);
    };
  }, []);
  return (
    <div className="Header flex w-full items-center">
      <div className="w-80 flex items-center gap-5 -mt-2">
        <div className="icon-fb">
          <img src={Logo} alt="duyanh" className="size-10 fb_logo mt-2 ml-5" />
        </div>

        <div>
          <div
            className={`Input mt-2 relatives w-full flex items-center ${
              isDarkMode ? "bg-[#3A3B3C]" : "bg-[#F0F2F5]"
            }`}
          >
            <div className="icon_search ml-3">
              <FaSearch
                className={isDarkMode ? "text-[#F0F2F5]" : "text-[#3A3B3C]"}
              />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm trên FaceBook"
              className="outline-none flex-none h-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={() => setHiddenSearch(true)}
            />
          </div>
          <div ref={hidden}>
            <SearchFriends
              friends={friends}
              hiddenSearch={hiddenSearch}
              setHiddenSearch={setHiddenSearch}
              isLoading={isLoading}
            />
          </div>
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
                  isDarkMode ? "text-[#fff]" : "text-[#65676b]"
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
                  isDarkMode
                    ? "text-[#fff] border border-white"
                    : "text-[#65676b] border border-[#65676b]"
                } size-8 rounded-full p-1`}
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
                  isDarkMode ? "text-[#fff]" : "text-[#3A3B3C]"
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
        {/* <div>
          <GoogleTranslate />
        </div> */}
        <div className="border-icon">
          <IoMdMenu
            className={`size-8 rounded-full ${
              isDarkMode
                ? "bg-[#3A3B3C] text-[#fff]"
                : "bg-[#f0f2f5] text-[#333]"
            }`}
          />
          <div className="text">
            <span className="">Menu</span>
          </div>
        </div>
        <div className="border-icon">
          <FaFacebookMessenger
            className={`size-6  ${
              isDarkMode ? " text-[#fff]" : " text-[#333]"
            }`}
            onClick={handleShowBoxMess}
          />

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

          <div ref={hiddenMes}>
            <BoxMessages
              data={data}
              getAllMess={getAllMess}
              fetchSeenUserData={fetchSeenUserData}
              setShowBox={setShowBox}
              showBox={showBox}
            />
          </div>
        </div>
        <div className="border-icon">
          <IoIosNotifications
            className={`size-8 rounded-full ${
              isDarkMode
                ? "bg-[#3A3B3C] text-[#fff]"
                : "bg-[#f0f2f5] text-[#333]"
            }`}
            onClick={hanldeShowNocatifion}
          />
          <span
            className={
              countNotifications
                ? "count absolute flex items-center justify-center"
                : ""
            }
          >
            <span className="text-count text-center text-white">
              {countNotifications ? countNotifications : ""}
            </span>
          </span>
          <div className="text">
            <span className="">Thông báo</span>
          </div>
          <div ref={hiddenNocatifion}>
            <Nocatifion
              showNocatfion={showNocatfion}
              setShowNocatfion={setShowNocatfion}
              dataNocatifion={dataNocatifion}
            />
          </div>
        </div>

        {avatar ? (
          <div className="online_radium" onClick={handleHidenModel}>
            <img
              className="w-10 h-10 object-cover rounded-full "
              src={avatar}
              alt="ảnh lỗi"
            />
          </div>
        ) : (
          <div className="border-icon " onClick={handleHidenModel}>
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
