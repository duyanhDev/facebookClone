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
import { useContext, useEffect, useRef, useState } from "react";
import Logo from "./../../asset/images/logo-vantc-1679219983.jpg";
import { getAllMessAPI, postLogOut } from "./../../service/apiAxios";

import BoxMessages from "../BoxMessages/BoxMessages";
import Nocatifion from "../Nocatifion/Nocatifion";
import SearchFriends from "../SearchFriends/SearchFriends";
import { AuthContext } from "../../AuthContext ";
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
  const { setIsAuthenticated, isAuthenticated } = useContext(AuthContext);
  const handleLogOut = async () => {
    try {
      // Call the logout API
      const response = await postLogOut(receiverId);
      console.log(response);

      if (response) {
        // Clear local storage
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("id");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("role");
        localStorage.removeItem("isOnline");
        setIsAuthenticated(false);

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
      <div className="w-80  flex items-center gap-5 -mt-2">
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
            <Link to="/">
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="currentColor"
              >
                <path d="M8.99 23H7.93c-1.354 0-2.471 0-3.355-.119-.928-.125-1.747-.396-2.403-1.053-.656-.656-.928-1.475-1.053-2.403C1 18.541 1 17.425 1 16.07v-4.3c0-1.738-.002-2.947.528-4.006.53-1.06 1.497-1.784 2.888-2.826L6.65 3.263c1.114-.835 2.02-1.515 2.815-1.977C10.294.803 11.092.5 12 .5c.908 0 1.707.303 2.537.786.795.462 1.7 1.142 2.815 1.977l2.232 1.675c1.391 1.042 2.359 1.766 2.888 2.826.53 1.059.53 2.268.528 4.006v4.3c0 1.355 0 2.471-.119 3.355-.124.928-.396 1.747-1.052 2.403-.657.657-1.476.928-2.404 1.053-.884.119-2 .119-3.354.119H8.99zM7.8 4.9l-2 1.5C4.15 7.638 3.61 8.074 3.317 8.658 3.025 9.242 3 9.937 3 12v4c0 1.442.002 2.424.101 3.159.095.706.262 1.033.485 1.255.223.223.55.39 1.256.485.734.099 1.716.1 3.158.1V14.5a2.5 2.5 0 0 1 2.5-2.5h3a2.5 2.5 0 0 1 2.5 2.5V21c1.443 0 2.424-.002 3.159-.101.706-.095 1.033-.262 1.255-.485.223-.222.39-.55.485-1.256.099-.734.101-1.716.101-3.158v-4c0-2.063-.025-2.758-.317-3.342-.291-.584-.832-1.02-2.483-2.258l-2-1.5c-1.174-.881-1.987-1.489-2.67-1.886C12.87 2.63 12.425 2.5 12 2.5c-.425 0-.87.13-1.53.514-.682.397-1.495 1.005-2.67 1.886zM14 21v-6.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5V21h4z"></path>
              </svg>
            </Link>
            <div className="text">
              <span className="">Trang chủ</span>
            </div>
          </li>
          <li>
            <Link>
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="currentColor"
                className="xfx01vb x1lliihq x1tzjh5l x1k90msu x2h7rmj x1qfuztq"
              >
                <path d="M16.496 1a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm-9 4.5a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM5.5 15a5 5 0 0 0-5 5 3 3 0 0 0 3 3h8.006a3 3 0 0 0 3-3 5 5 0 0 0-5-5H5.5zm9-4.5c-.671 0-1.158.46-1.333.966a5.948 5.948 0 0 1-.303.718 1.558 1.558 0 0 0 .525 1.99 7.026 7.026 0 0 1 2.663 3.34c.215.565.76.986 1.418.986h3.036a3 3 0 0 0 3-3 5 5 0 0 0-5-5H14.5z"></path>
              </svg>
            </Link>
            <div className="text">
              <span className="">Bạn bè</span>
            </div>
          </li>
          <li>
            <Link>
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="currentColor"
                className={`${
                  isDarkMode ? "text-[#fff]" : "text-[#333]"
                } text-3xl`}
              >
                <path d="M10.996 8.132A1 1 0 0 0 9.5 9v4a1 1 0 0 0 1.496.868l3.5-2a1 1 0 0 0 0-1.736l-3.5-2z"></path>
                <path d="M14.573 2H9.427c-1.824 0-3.293 0-4.45.155-1.2.162-2.21.507-3.013 1.31C1.162 4.266.817 5.277.655 6.477.5 7.634.5 9.103.5 10.927v.146c0 1.824 0 3.293.155 4.45.162 1.2.507 2.21 1.31 3.012.802.803 1.813 1.148 3.013 1.31C6.134 20 7.603 20 9.427 20h5.146c1.824 0 3.293 0 4.45-.155 1.2-.162 2.21-.507 3.012-1.31.803-.802 1.148-1.813 1.31-3.013.155-1.156.155-2.625.155-4.449v-.146c0-1.824 0-3.293-.155-4.45-.162-1.2-.507-2.21-1.31-3.013-.802-.802-1.813-1.147-3.013-1.309C17.866 2 16.397 2 14.573 2zM3.38 4.879c.369-.37.887-.61 1.865-.741C6.251 4.002 7.586 4 9.5 4h5c1.914 0 3.249.002 4.256.138.978.131 1.496.372 1.865.74.37.37.61.888.742 1.866.135 1.007.137 2.342.137 4.256 0 1.914-.002 3.249-.137 4.256-.132.978-.373 1.496-.742 1.865-.369.37-.887.61-1.865.742-1.007.135-2.342.137-4.256.137h-5c-1.914 0-3.249-.002-4.256-.137-.978-.132-1.496-.373-1.865-.742-.37-.369-.61-.887-.741-1.865C2.502 14.249 2.5 12.914 2.5 11c0-1.914.002-3.249.138-4.256.131-.978.372-1.496.74-1.865zM8 21.5a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2H8z"></path>
              </svg>
            </Link>
            <div className="text">
              <span className="">Video</span>
            </div>
          </li>
          <li>
            <Link>
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="currentColor"
              >
                <path d="M1.588 3.227A3.125 3.125 0 0 1 4.58 1h14.84c1.38 0 2.597.905 2.993 2.227l.816 2.719a6.47 6.47 0 0 1 .272 1.854A5.183 5.183 0 0 1 22 11.455v4.615c0 1.355 0 2.471-.119 3.355-.125.928-.396 1.747-1.053 2.403-.656.657-1.475.928-2.403 1.053-.884.12-2 .119-3.354.119H8.929c-1.354 0-2.47 0-3.354-.119-.928-.125-1.747-.396-2.403-1.053-.657-.656-.929-1.475-1.053-2.403-.12-.884-.119-2-.119-3.354V11.5l.001-.045A5.184 5.184 0 0 1 .5 7.8c0-.628.092-1.252.272-1.854l.816-2.719zM10 21h4v-3.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5V21zm6-.002c.918-.005 1.608-.025 2.159-.099.706-.095 1.033-.262 1.255-.485.223-.222.39-.55.485-1.255.099-.735.101-1.716.101-3.159v-3.284a5.195 5.195 0 0 1-1.7.284 5.18 5.18 0 0 1-3.15-1.062A5.18 5.18 0 0 1 12 13a5.18 5.18 0 0 1-3.15-1.062A5.18 5.18 0 0 1 5.7 13a5.2 5.2 0 0 1-1.7-.284V16c0 1.442.002 2.424.1 3.159.096.706.263 1.033.486 1.255.222.223.55.39 1.255.485.551.074 1.24.094 2.159.1V17.5a2.5 2.5 0 0 1 2.5-2.5h3a2.5 2.5 0 0 1 2.5 2.5v3.498zM4.581 3c-.497 0-.935.326-1.078.802l-.815 2.72A4.45 4.45 0 0 0 2.5 7.8a3.2 3.2 0 0 0 5.6 2.117 1 1 0 0 1 1.5 0A3.19 3.19 0 0 0 12 11a3.19 3.19 0 0 0 2.4-1.083 1 1 0 0 1 1.5 0A3.2 3.2 0 0 0 21.5 7.8c0-.434-.063-.865-.188-1.28l-.816-2.72A1.125 1.125 0 0 0 19.42 3H4.58z"></path>
              </svg>
            </Link>

            <div className="text">
              <span className="">Marketplace</span>
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
