import "./SiderLeft.scss";
import { IoMdContact } from "react-icons/io";
import { FaUserFriends, FaAngleDown } from "react-icons/fa";
import { PiMonitorPlayLight } from "react-icons/pi";
import { FaBookmark, FaRegClock } from "react-icons/fa6";
import { MdGroupWork } from "react-icons/md";
import { Link } from "react-router-dom";
const SliderLeft = () => {
  return (
    <div className="nav_left">
      <div className="top w-full -mt-7 ">
        <ul className="top-ul">
          <li>
            <Link>
              <div className="flex justify-center items-center gap-2">
                {" "}
                <IoMdContact className="size-6 " />
                Duy Anh
              </div>
            </Link>
          </li>
          <li>
            <Link>
              <div className="flex justify-center items-center gap-2">
                {" "}
                <FaUserFriends className="size-7 " />
                Bạn bè
              </div>
            </Link>
          </li>
          <li>
            <Link>
              <div className="flex justify-center items-center gap-2">
                {" "}
                <PiMonitorPlayLight className="size-7 text-[#0866ff] " />
                Video
              </div>
            </Link>
          </li>
          <li>
            <Link>
              <div className="flex justify-center items-center gap-2 text-[#fa61ba]">
                {" "}
                <FaBookmark className="size-7 " />
                Đã lưu
              </div>
            </Link>
          </li>
          <li>
            <Link>
              <div className="flex justify-center items-center gap-2">
                {" "}
                <FaRegClock className="size-7 " />
                Kỉ niệm
              </div>
            </Link>
          </li>
          <li>
            <Link>
              <div className="flex justify-center items-center gap-2">
                {" "}
                <MdGroupWork className="size-7 " />
                Nhóm
              </div>
            </Link>
          </li>

          <li>
            <Link>
              <div className="flex justify-center items-center gap-2">
                {" "}
                <FaAngleDown className="size-7 " />
                Xem thêm
              </div>
            </Link>
          </li>
        </ul>
      </div>
      <div className="bottom mt-2">
        <div className="flex justify-between items-center">
          <h3 className="ml-1">Lỗi tắt của bạn</h3>
          <span>Chỉnh sửa</span>
        </div>
        <div className="fried">
          <ul>
            <li>
              <Link>
                <div className="flex  gap-2">
                  {" "}
                  <MdGroupWork className="size-7 " />
                  Nhóm
                </div>
              </Link>
            </li>
            <li>
              <Link>
                <div className="flex  gap-2">
                  {" "}
                  <MdGroupWork className="size-7 " />
                  Nhóm
                </div>
              </Link>
            </li>
            <li>
              <Link>
                <div className="flex gap-2">
                  {" "}
                  <MdGroupWork className="size-7 " />
                  Nhóm
                </div>
              </Link>
            </li>
            <li>
              <Link>
                <div className="flex gap-2">
                  {" "}
                  <MdGroupWork className="size-7 " />
                  Nhóm
                </div>
              </Link>
            </li>
            <li>
              <Link>
                <div className="flex gap-2">
                  {" "}
                  <MdGroupWork className="size-7 " />
                  Nhóm
                </div>
              </Link>
            </li>
            <li>
              <Link>
                <div className="flex  gap-2">
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
