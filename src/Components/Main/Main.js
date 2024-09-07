import "./Main.scss";
import React, { useState, useRef } from "react";
import Slider from "react-slick";
import lin from "./../../asset/images/9k30do0bqc18mwiah22809g28a5n.png";
import avtart from "./../../asset/images/2.png";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { AiFillPlusCircle } from "react-icons/ai";
import { MdVideoCameraFront, MdInsertEmoticon } from "react-icons/md";
import { BsFillFileImageFill } from "react-icons/bs";
import Status from "../Status/Status";
const Main = () => {
  const sliderRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  let settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false, // Ẩn mũi tên mặc định
  };

  const handlePrevClick = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  const handleNextClick = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  return (
    <div className="slider-container">
      <Slider
        {...settings}
        ref={sliderRef}
        className="w_slider flex gap-1  cursor-pointer"
      >
        <div className="flex items-center  ">
          <img className="slider-image" src={avtart} alt="ảnh lỗi" />
          <div className="news ">
            <div className="icon">
              <AiFillPlusCircle className="size-9 text-[#0866ff]" />
            </div>
            <span>Tạo Tin</span>
          </div>
        </div>
        <div className="flex items-center ">
          <img className="slider-image" src={lin} alt="ảnh lỗi" />
          <div className="news_name">
            <span>Duy Anh</span>
          </div>
        </div>
        <div className="flex items-center ">
          <img className="slider-image" src={lin} alt="ảnh lỗi" />
          <div className="news_name">
            <span>Nguyễn Thị Thảo</span>
          </div>
        </div>
        <div className="flex items-center ">
          <img className="slider-image" src={lin} alt="ảnh lỗi" />
          <div className="news_name">
            <span>Đào Thị Như Băng</span>
          </div>
        </div>
        <div className="flex items-center ">
          <img className="slider-image" src={lin} alt="ảnh lỗi" />
          <div className="news_name">
            <span>Đào Thị Như Băng</span>
          </div>
        </div>
        <div className="flex items-center ">
          <img className="slider-image" src={lin} alt="ảnh lỗi" />
          <div className="news_name">
            <span>Đào Thị Như Băng</span>
          </div>
        </div>
      </Slider>
      <button className="custom-prev" onClick={handlePrevClick}>
        &lt;
      </button>
      <button className="custom-next" onClick={handleNextClick}>
        &gt;
      </button>
      <div className="content_status m-auto text-center mt-8 h-32 ">
        <div className="w-full flex items-center gap-4 ml-4  bottom_text mt-5">
          <img src={avtart} alt="lỗi" className="image_status" />
          <Status showModal={showModal} setShowModal={setShowModal} />
        </div>

        <div className="live flex justify-between pt-12 ml-3 ">
          <div className="w-full flex justify-between items-center -mt-10 cursor-pointer ">
            <div className="flex items-center justify-center gap-2">
              <MdVideoCameraFront className="size-8 text-red-800 " />
              <span>Video Trực Tiếp</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <BsFillFileImageFill className="size-8 text-green-800" />
              <span>Ảnh/Video</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <MdInsertEmoticon className="size-8 text-yellow-400 " />
              <span>Cảm xúc hoạt động</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
