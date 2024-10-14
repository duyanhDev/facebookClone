import "./SiderLeft.scss";
import { IoMdContact } from "react-icons/io";
import { FaUserFriends, FaAngleDown } from "react-icons/fa";
import { PiMonitorPlayLight } from "react-icons/pi";
import { FaBookmark, FaRegClock } from "react-icons/fa6";
import { MdGroupWork } from "react-icons/md";
import { Link } from "react-router-dom";
const SliderLeft = ({ username, isDarkMode, friend }) => {
  const avatar = localStorage.getItem("avatar");
  const isOnline = localStorage.getItem("isOnline");

  const onlineFriendsCount = friend
    ? friend.filter((friend) => friend.isOnline).length
    : "";
  return (
    <div className="nav_left">
      <div className="top w-full -mt-7 ">
        <ul className="top-ul">
          <li>
            <Link>
              <div
                className={`flex justify-center items-center gap-2 ${
                  isDarkMode ? "text-[#fff]" : "text-[#333]"
                }`}
              >
                {" "}
                {avatar ? (
                  <img
                    className="w-8 h-8 object-cover rounded-full"
                    src={avatar}
                    alt="ảnh lỗi"
                  />
                ) : (
                  <IoMdContact className="size-6 " />
                )}
                {username ? username : ""}
              </div>
            </Link>
          </li>
          <li>
            <Link>
              <div
                className={`flex justify-center items-center gap-2 ${
                  isDarkMode ? "text-[#fff]" : "text-[#333]"
                }`}
              >
                {" "}
                <FaUserFriends
                  className={`size-6 ${
                    isDarkMode ? "text-blue-600" : "text-[#333]"
                  }`}
                />
                Bạn bè{" "}
                {
                  <h3>
                    {onlineFriendsCount > 0
                      ? `(${onlineFriendsCount} người online)`
                      : ""}
                  </h3>
                }
              </div>
            </Link>
          </li>
          <li>
            <Link>
              <div
                className={`flex justify-center items-center gap-2 ${
                  isDarkMode ? "text-[#fff]" : "text-[#333]"
                }`}
              >
                {" "}
                <PiMonitorPlayLight className="size-7 text-blue-600 " />
                Video
              </div>
            </Link>
          </li>
          <li>
            <Link>
              <div
                className={`flex justify-center items-center gap-2 ${
                  isDarkMode ? "text-[#fff]" : "text-[#333]"
                }`}
              >
                {" "}
                <FaBookmark className="size-7 text-[#fa61ba] " />
                Đã lưu
              </div>
            </Link>
          </li>
          <li>
            <Link>
              <div
                className={`flex justify-center items-center gap-2 ${
                  isDarkMode ? "text-[#fff]" : "text-[#333]"
                }`}
              >
                {" "}
                <FaRegClock className="size-7  text-blue-600" />
                Kỉ niệm
              </div>
            </Link>
          </li>
          <li>
            <Link>
              <div
                className={`flex justify-center items-center gap-2 ${
                  isDarkMode ? "text-[#fff]" : "text-[#333]"
                }`}
              >
                {" "}
                <MdGroupWork className="size-7  text-blue-600 " />
                Nhóm
              </div>
            </Link>
          </li>

          <li>
            <Link>
              <div
                className={`flex justify-center items-center gap-2 ${
                  isDarkMode ? "text-[#fff]" : "text-[#333]"
                }`}
              >
                {" "}
                <FaAngleDown className="size-7  text-blue-600 " />
                Xem thêm
              </div>
            </Link>
          </li>
        </ul>
      </div>
      <div className="bottom mt-2">
        <div className="flex justify-between items-center">
          <h3 className={`ml-1 ${isDarkMode ? "text-[#fff]" : "text-[#333]"}`}>
            Lỗi tắt của bạn
          </h3>
          <span className={` ${isDarkMode ? "text-[#fff]" : "text-[#333]"}`}>
            Chỉnh sửa
          </span>
        </div>
        <div className="fried">
          <ul>
            <li>
              <Link>
                <div
                  className={`flex  gap-2 ${
                    isDarkMode ? "text-[#fff]" : "text-[#333]"
                  }`}
                >
                  {" "}
                  <MdGroupWork className="size-7 text-blue-600" />
                  Nhóm
                </div>
              </Link>
            </li>
            <li>
              <Link>
                <div
                  className={`flex  gap-2 ${
                    isDarkMode ? "text-[#fff]" : "text-[#333]"
                  }`}
                >
                  {" "}
                  <MdGroupWork className="size-7 " />
                  Nhóm
                </div>
              </Link>
            </li>
            <li>
              <Link>
                <div
                  className={`flex  gap-2 ${
                    isDarkMode ? "text-[#fff]" : "text-[#333]"
                  }`}
                >
                  {" "}
                  <MdGroupWork className="size-7 " />
                  Nhóm
                </div>
              </Link>
            </li>
            <li>
              <Link>
                <div
                  className={`flex  gap-2 ${
                    isDarkMode ? "text-[#fff]" : "text-[#333]"
                  }`}
                >
                  {" "}
                  <MdGroupWork className="size-7 " />
                  Nhóm
                </div>
              </Link>
            </li>
            <li>
              <Link>
                <div
                  className={`flex  gap-2 ${
                    isDarkMode ? "text-[#fff]" : "text-[#333]"
                  }`}
                >
                  {" "}
                  <MdGroupWork className="size-7 " />
                  Nhóm
                </div>
              </Link>
            </li>
            <li>
              <Link>
                <div
                  className={`flex  gap-2 ${
                    isDarkMode ? "text-[#fff]" : "text-[#333]"
                  }`}
                >
                  {" "}
                  <FaAngleDown className="size-7 " />
                  Xem thêm
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SliderLeft;
