import "./SiderRight.scss";
import avtar1 from "./../../asset/images/9k30do0bqc18mwiah22809g28a5n.png";
import avtar2 from "./../../asset/images/457387929_120213262673200198_5477046213234344355_n.jpg";
import avtar3 from "./../../asset/images/457581765_6650019743920_7145976287699803331_n.jpg";
import icon1 from "./../../asset/images/1.png";
import lin from "./../../asset/images/linjpg.jpg";
import { CiGift } from "react-icons/ci";
import { useEffect, useState, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import {
  IoEllipsisHorizontal,
  IoReloadCircleSharp,
  IoResizeOutline,
} from "react-icons/io5";
import { TbSpeakerphone } from "react-icons/tb";

const SiderRight = ({ add }) => {
  console.log(add);

  const [imageIndex, setImageIndex] = useState(0); // Lưu chỉ mục của ảnh hiện tại
  const [active, setActive] = useState(false);
  const [model, SetModel] = useState(false);
  const modalRef = useRef(null);
  const avatar = [
    {
      title:
        "Chó Corgi là giống chó nhỏ, thân dài và chân ngắn, có nguồn gốc từ xứ Wales",
      avatar: avtar1,
    },
    {
      title: "Chó Corgi là giống chó nhỏ",
      avatar: avtar2,
    },
    {
      title: "Chó Corgi là giống chó nhỏ",
      avatar: avtar3,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setImageIndex((prevIndex) => (prevIndex + 1) % avatar.length); // Cập nhật chỉ mục ảnh
    }, 1000);

    return () => clearInterval(timer); // Dọn dẹp interval khi component bị hủy
  }, [avatar.length]);

  const currentImage = avatar[imageIndex]; // Lấy ảnh hiện tại dựa trên chỉ mục
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setActive(false); // Ẩn modal nếu click ra ngoài
      // Ẩn modal thứ hai nếu đang hiển thị
    }
  };
  const handleCick = () => {
    setActive(!active);
  };
  const handleHidenModel = () => {
    SetModel(!model);
    setActive(!active);
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="main-right">
      <div className="mt-3 main_border">
        <h1 className="size-7 font-bold whitespace-nowrap text-[#65676B]">
          Được tài trợ
        </h1>
        <div className="marketing flex items-center gap-3">
          <img
            className="w-44 h-32 image"
            src={currentImage.avatar}
            alt="lỗi ảnh"
          />
          <div className="mr-5">
            <h2>{currentImage.title}</h2>
          </div>
        </div>
        <div className="marketing flex items-center mt-4 gap-3">
          <img
            className="w-44 h-32 image"
            src={currentImage.avatar}
            alt="lỗi ảnh"
          />
          <div className="mr-5">
            <h2>{currentImage.title}</h2>
          </div>
        </div>
      </div>
      <div className="fanpage">
        <div className="mt-2 flex justify-between items-center">
          <h3 className="text-[#65686c] font-bold">
            Trang và trang cá nhân của bạn
          </h3>
          <span>
            <IoEllipsisHorizontal
              className="size-6"
              onClick={() => handleCick()}
            />
          </span>
        </div>
        <div className={active ? "model active" : "model"} ref={modalRef}>
          <div
            className="flex items-center gap-3 p-6 cursor-pointer"
            onClick={() => handleHidenModel()}
          >
            <IoResizeOutline />
            <span>
              {model ? "Mở rộng bảng điều khiển" : "Thu gọn bảng điều khiển"}
            </span>
          </div>
          <div className="flex tems-center gap-3 p-6 cursor-pointer fanpage_top  -mt-9">
            <img className="" src={icon1} alt="icon lỗi" />
            <h3>Duy Anh </h3>
          </div>
        </div>
        <div className={model ? "none active_model" : "none"}>
          <div className="mt-1 flex items-center gap-2 fanpage_top">
            <img className="" src={icon1} alt="icon lỗi" />
            <h3>Duy Anh </h3>
          </div>
          <div className="mt-4 ml-4 flex items-center gap-2">
            <IoReloadCircleSharp className="size-5 text-[#65686c]" />
            <span>Chuyển sang trang</span>
          </div>
          <div className="mt-4 ml-4 flex items-center gap-2">
            <TbSpeakerphone className="size-5 text-[#65686c]" />
            <span>Tạo bài viết quảng bá</span>
          </div>
        </div>
      </div>
      <div className="add_friend mt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[#65686c] font-bold ">Lời mời kết bạn</h3>
          <span className="cursor-pointer">Xem tất cả</span>
        </div>
        <div className="flex items-center gap-2 mt-2 cursor-pointer">
          <div className="flex items-center">
            <img className="img_avtart " src={lin} alt="ảnh kết bạn bị lỗi " />
            <div className="pt-3 -mt-5 ml-5">
              <span>{add}</span>
              <div className="pt-1 flex items-center ">
                <img className="img_friends" src={lin} alt="lỗi" />
                <span className="ml-2">2 bạn chung</span>
              </div>
            </div>
          </div>
        </div>
        <div className="btn_adds flex space-x-2 ml-20 ">
          <button
            type="button"
            className="sm:w-40 min-w-0 text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Xác Nhận
          </button>
          <button
            type="button"
            className="sm:w-40 min-w-0 text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Xóa
          </button>
        </div>
      </div>
      <div className="add_friend mt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[#65686c] font-bold ">Sinh nhật</h3>
          <span className="cursor-pointer">Xem tất cả</span>
        </div>
        <div className="flex items-center gap-2 mt-2 cursor-pointer">
          <CiGift className="size-9 text-[#0866ff]" />
          <h3>Hôm nay là sinh của Duy Anh và 2 người khác.</h3>
        </div>
      </div>

      <div className="add_friend mt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[#65686c] font-bold ">Người liên hệ</h3>
          <div className="flex items-center gap-4 mr-3">
            <FaSearch />
            <IoEllipsisHorizontal />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2 cursor-pointer">
          <div className="flex items-center gap-3">
            <span className="span_green">
              {" "}
              <img className="best_friend" src={icon1} alt="lỗi" />
            </span>
            <span>Đặng Trịnh Duy Anh</span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2 cursor-pointer">
          <div className="flex items-center gap-3">
            <span className="span_green">
              {" "}
              <img className="best_friend" src={icon1} alt="lỗi" />
            </span>
            <span>Duy Anh</span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2 cursor-pointer">
          <div className="flex items-center gap-3">
            <span className="span_green">
              {" "}
              <img className="best_friend" src={icon1} alt="lỗi" />
            </span>
            <span>Duy Anh</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiderRight;
