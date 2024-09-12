import "./Main.scss";
import React, { useState, useRef, useEffect } from "react";
import Slider from "react-slick";
import lin from "./../../asset/images/9k30do0bqc18mwiah22809g28a5n.png";
import avtart from "./../../asset/images/2.png";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { AiFillPlusCircle } from "react-icons/ai";
import { MdVideoCameraFront, MdInsertEmoticon } from "react-icons/md";
import { BsFillFileImageFill } from "react-icons/bs";
import Status from "../Status/Status";
import { getPostNewUsers, postLikeFromAPI } from "../../service/apiAxios";
import { IoEllipsisHorizontal, IoEarth } from "react-icons/io5";
import { AiOutlineLike } from "react-icons/ai";
import { FaRegComment, FaRegLaughSquint, FaHeart } from "react-icons/fa";
import {
  FaRegFaceGrinHearts,
  FaRegFaceSurprise,
  FaRegFaceSadTear,
  FaRegFaceTired,
} from "react-icons/fa6";
import { PiShareFatThin } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { fetchLikesCount } from "../../reduxToolKit/like/likesSlice";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const Main = () => {
  const userId = localStorage.getItem("id");

  const sliderRef = useRef(null);
  let [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  let settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false, // Ẩn mũi tên mặc định
  };
  // const defaultImage = "https://via.placeholder.com/150";

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
  const getPostAPI = async () => {
    let res = await getPostNewUsers();
    if (res && res.data && res.data.data && res.status === 200) {
      setData(res.data.data);
    }
  };

  useEffect(() => {
    getPostAPI();
  }, []);

  const getTimeAgoInMinutes = (postTime) => {
    const now = new Date(); // Current time
    const postDate = new Date(postTime); // Convert postTime to Date object

    const diffInMilliseconds = now - postDate;
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60)); // Convert milliseconds to minutes
    if (diffInMinutes === 0) {
      return `vừa xong`;
    } else if (diffInMinutes < 60) {
      // If less than 60 minutes, return minutes
      return `${diffInMinutes} phút`;
    } else {
      const diffInHours = Math.floor(diffInMinutes / 60); // Convert minutes to hours
      return `${diffInHours} giờ`;
    }
  };

  const dispatch = useDispatch();
  const totalLikes = useSelector((state) => state.likes.totalLikes);
  // const status = useSelector((state) => state.likes.status);
  // const error = useSelector((state) => state.likes.error);

  useEffect(() => {
    const postIds = data.map((item) => item._id).join(",");
    if (postIds) {
      dispatch(fetchLikesCount(postIds));
    }
  }, [data, dispatch]);

  const likesMap = totalLikes.reduce((acc, like) => {
    const postId = like._id;
    if (postId) {
      acc[postId] = like.totalLikes;
    }
    return acc;
  }, {});
  const [selectedReaction, setSelectedReaction] = useState("like");
  const handleClickLike = async (_id, authorId, reaction) => {
    let res = await postLikeFromAPI(_id, authorId, userId, reaction);
    setSelectedReaction(reaction);
    if (res) {
    }
  };
  const getReactionIcon = (reaction) => {
    switch (reaction) {
      case "like":
        return <AiOutlineLike size={20} color="blue" />;
      case "love":
        return <FaHeart size={20} color="red" />;
      case "thương thương":
        return <FaRegFaceGrinHearts size={20} color="orange" />;
      case "haha":
        return <FaRegLaughSquint size={20} color="orange" />;
      case "wow":
        return <FaRegFaceSurprise size={20} color="orange" />;
      case "sad":
        return <FaRegFaceSadTear size={20} color="orange" />;
      case "angry":
        return <FaRegFaceTired size={20} color="orange" />;
      default:
        return <AiOutlineLike className="text-gray-600" />;
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
          <Status
            showModal={showModal}
            setShowModal={setShowModal}
            getPostAPI={getPostAPI}
            data={data}
            setData={setData}
          />
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

      {data &&
        data.length > 0 &&
        data.map((item) => {
          const userReaction = item.likes.find(
            (like) => like.userId === userId
          )?.reaction;
          return (
            <div
              className="content_status m-auto mt-8 min-h-max p-5"
              key={item._id}
            >
              <div
                className="post flex items-center justify-between m-4 -mt-5 pt-2"
                key={item._id}
              >
                <div className="flex gap-5 items-center">
                  <img
                    className="post_image w-10 h-10 object-cover m-0 border"
                    src={item.avatar}
                    alt="anh lỗi"
                  />
                  <div>
                    <p>{item.authorName}</p>
                    <p className="flex items-center gap-1">
                      {getTimeAgoInMinutes(item.createdAt)} <IoEarth />
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <IoEllipsisHorizontal />
                  <span>X</span>
                </div>
              </div>
              <div className="-mt-5 ml-3">
                <span className="p-3 block justify-text">{item.content}</span>
              </div>
              <div className="w-4/5 flex items-center justify-center m-auto">
                <div className="w-4/5 flex items-center justify-center m-auto">
                  <Zoom>
                    <picture>
                      {item.image && <img src={item.image} alt="ảnh lỗi" />}
                    </picture>
                  </Zoom>
                </div>
              </div>
              <div className="w-4/5 m-auto pr-2 pl-2 flex justify-between items-center  mt-3 cursor-pointer">
                <span>
                  {likesMap[item._id] ? `${likesMap[item._id]} thích ` : ""}
                </span>
                <div className=" hover_icon ">
                  <span
                    className="flex gap-1 items-center cursor-pointer"
                    onClick={() =>
                      handleClickLike(item._id, item.authorId, "like")
                    }
                  >
                    {/* Display the appropriate reaction icon based on userReaction */}
                    {userReaction ? (
                      getReactionIcon(userReaction)
                    ) : (
                      <>
                        <AiOutlineLike className="text-gray-600" />
                        Thích
                      </>
                    )}
                  </span>
                  <div className="laugh-icon flex items-center gap-5 absolute ">
                    <span className="icon-animation">
                      <AiOutlineLike
                        size={20}
                        color="blue"
                        onClick={() =>
                          handleClickLike(item._id, item.authorId, "like")
                        }
                      />
                    </span>
                    <span
                      className="icon-animation"
                      onClick={() =>
                        handleClickLike(item._id, item.authorId, "love")
                      }
                    >
                      <FaHeart size={20} color="red" />
                    </span>

                    <span className="icon-animation">
                      <FaRegFaceGrinHearts
                        size={20}
                        color="orange"
                        onClick={() =>
                          handleClickLike(
                            item._id,
                            item.authorId,
                            "thương thương"
                          )
                        }
                      />
                    </span>
                    <span className="icon-animation">
                      <FaRegLaughSquint
                        size={20}
                        color="orange"
                        onClick={() =>
                          handleClickLike(item._id, item.authorId, "haha")
                        }
                      />
                    </span>
                    <span className="icon-animation">
                      <FaRegFaceSurprise
                        size={20}
                        color="orange"
                        onClick={() =>
                          handleClickLike(item._id, item.authorId, "wow")
                        }
                      />
                    </span>
                    <span className="icon-animation">
                      <FaRegFaceSadTear
                        size={20}
                        color="orange"
                        onClick={() =>
                          handleClickLike(item._id, item.authorId, "sad")
                        }
                      />
                    </span>
                    <span className="icon-animation">
                      <FaRegFaceTired
                        size={20}
                        color="orange"
                        onClick={() =>
                          handleClickLike(item._id, item.authorId, "angry")
                        }
                      />
                    </span>
                  </div>
                </div>

                <span className="flex gap-1 items-center cursor-pointer">
                  {" "}
                  <FaRegComment />
                  Bình Luận
                </span>
                <span className="flex items-center gap-1 cursor-pointer">
                  <PiShareFatThin />
                  Chia Sẻ
                </span>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Main;
