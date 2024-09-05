import "./Main.scss";
import React, { useRef } from "react";
import Slider from "react-slick";
import lin from "./../../asset/images/9k30do0bqc18mwiah22809g28a5n.png";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Main = () => {
  const sliderRef = useRef(null);

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
      <Slider {...settings} ref={sliderRef} className="w_slider flex gap-2">
        <div className="flex items-center gap-3">
          <img className="slider-image" src={lin} alt="ảnh lỗi" />
        </div>
        <div className="flex items-center gap-1">
          <img className="slider-image" src={lin} alt="ảnh lỗi" />
        </div>
        <div className="flex items-center gap-1">
          <img className="slider-image" src={lin} alt="ảnh lỗi" />
        </div>
        <div className="flex items-center gap-1">
          <img className="slider-image" src={lin} alt="ảnh lỗi" />
        </div>
        <div className="flex items-center gap-1">
          <img className="slider-image" src={lin} alt="ảnh lỗi" />
        </div>
        <div className="flex items-center gap-1">
          <img className="slider-image" src={lin} alt="ảnh lỗi" />
        </div>
      </Slider>
      <button className="custom-prev" onClick={handlePrevClick}>
        &lt;
      </button>
      <button className="custom-next" onClick={handleNextClick}>
        &gt;
      </button>
    </div>
  );
};

export default Main;
