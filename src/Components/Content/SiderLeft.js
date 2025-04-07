import "./SiderLeft.scss";
import { IoMdContact } from "react-icons/io";
import { FaUserFriends, FaAngleDown } from "react-icons/fa";
import { PiMonitorPlayLight } from "react-icons/pi";
import { FaBookmark, FaRegClock } from "react-icons/fa6";
import { MdGroupWork } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

const SliderLeft = ({ username, isDarkMode, friend, currentUserId }) => {
  const avatar = localStorage.getItem("avatar");
  const navigate = useNavigate();
  const onlineFriendsCount = friend
    ? friend.filter((friend) => friend.isOnline).length
    : 0;

  return (
    <div className="main_left_nav">
      <div className="top p-6">
        {/* Profile Section */}
        <div className="profile mb-8">
          <div
            onClick={() => navigate(`profile/${currentUserId}`)}
            className="group flex items-center gap-4 p-3 rounded-xl bg-gray-100/50 hover:bg-gray-200 cursor-pointer transition-all duration-300"
          >
            {avatar ? (
              <img
                className="w-12 h-12 object-cover rounded-full border-2 border-blue-500 group-hover:border-blue-400 transition-all duration-300"
                src={avatar}
                alt="Avatar"
              />
            ) : (
              <IoMdContact className="size-12 text-blue-500 group-hover:text-blue-400 transition-all duration-300" />
            )}
            <div className="flex flex-col">
              <span className="text-gray-800 font-semibold text-lg group-hover:text-blue-500 transition-all duration-300">
                {username || "User"}
              </span>
              <span className="text-gray-500 text-sm">Online</span>
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <ul className="space-y-3">
          <li className="group relative" onClick={() => navigate("/friends")}>
            <Link className="flex items-center gap-4 p-3 rounded-xl  cursor-pointer transition-all duration-300">
              <FaUserFriends className="size-7 text-blue-500 group-hover:text-blue-400 group-hover:scale-110 transition-all duration-300" />
              <span className="text-gray-800 text-base group-hover:text-blue-500 transition-all duration-300">
                Bạn bè
                {onlineFriendsCount > 0 && (
                  <span className="ml-2 text-sm text-green-500">
                    ({onlineFriendsCount} online)
                  </span>
                )}
              </span>
              {/* Tooltip */}
            </Link>
          </li>
          <li className="group relative">
            <Link className="flex items-center gap-4 p-3 rounded-xl  cursor-pointer transition-all duration-300">
              <PiMonitorPlayLight className="size-7 text-blue-500 group-hover:text-blue-400 group-hover:scale-110 transition-all duration-300" />
              <span className="text-gray-800 text-base group-hover:text-blue-500 transition-all duration-300">
                Video
              </span>
              {/* Tooltip */}
            </Link>
          </li>
          <li className="group relative">
            <Link className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-100 cursor-pointer transition-all duration-300">
              <FaBookmark className="size-7 text-pink-500 group-hover:text-pink-400 group-hover:scale-110 transition-all duration-300" />
              <span className="text-gray-800 text-base group-hover:text-pink-500 transition-all duration-300">
                Đã lưu
              </span>
              {/* Tooltip */}
            </Link>
          </li>
          <li className="group relative">
            <Link className="flex items-center gap-4 p-3 rounded-xl  cursor-pointer transition-all duration-300">
              <FaRegClock className="size-7 text-blue-500 group-hover:text-blue-400 group-hover:scale-110 transition-all duration-300" />
              <span className="text-gray-800 text-base group-hover:text-blue-500  duration  transition-all duration-300">
                Kỉ niệm
              </span>
              {/* Tooltip */}
            </Link>
          </li>
          <li className="group relative">
            <Link className="flex items-center gap-4 p-3 rounded-xl  cursor-pointer transition-all duration-300">
              <MdGroupWork className="size-7 text-blue-500 group-hover:text-blue-400 group-hover:scale-110 transition-all duration-300" />
              <span className="text-gray-800 text-base group-hover:text-blue-500 transition-all duration-300">
                Nhóm
              </span>
              {/* Tooltip */}
            </Link>
          </li>
          <li className="group relative">
            <Link className="flex items-center gap-4 p-3 rounded-xl  cursor-pointer transition-all duration-300">
              <FaAngleDown className="size-7 text-blue-500 group-hover:text-blue-400 group-hover:scale-110 transition-all duration-300" />
              <span className="text-gray-800 text-base group-hover:text-blue-500 transition-all duration-300">
                Xem thêm
              </span>
              {/* Tooltip */}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SliderLeft;
