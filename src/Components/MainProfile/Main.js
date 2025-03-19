import "./Main.scss";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Slider from "react-slick";
import lin from "./../../asset/images/9k30do0bqc18mwiah22809g28a5n.png";
import avtart from "./../../asset/images/2.png";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { AiFillPlusCircle } from "react-icons/ai";
import { MdVideoCameraFront, MdInsertEmoticon } from "react-icons/md";
import { BsFillFileImageFill } from "react-icons/bs";
import Status from "../Status/Status";
import {
  getPostOneUsers,
  postLikeFromAPI,
  getCommentsAPI,
  CreateCommentsAPI,
  postCommentLikes,
  getCountComments,
  postReplyComment,
  postLikeCommentReply,
  GetAllStoriesAPIFB,
} from "../../service/apiAxios";
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
import { fetchLikesCountComment } from "../../reduxToolKit/comment/commentSlice";

import "react-medium-image-zoom/dist/styles.css";
import { toast } from "react-toastify";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import sensitiveWordsData from "./../../sensitive-words.json";
import { fetchLikesCountReply } from "../../reduxToolKit/likeReply/likesReplySlice";

const Main = ({ profile }) => {
  const userId = localStorage.getItem("id");
  const username = localStorage.getItem("name");
  const sliderRef = useRef(null);
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [contents, setContents] = useState(Array(data.length).fill(""));
  const [image, setImage] = useState(null);
  const { isDarkMode, fetchCountNotification } = useOutletContext();
  const avatar = localStorage.getItem("avatar");
  const [showReplie, setShowReplie] = useState(false);
  const [showName, setShowName] = useState("");
  const [showID, setShowID] = useState("");
  const [showCmt, setShowCmt] = useState("");
  const [showPostID, setShowPostID] = useState("");

  const params = useParams();

  const [contentCmt, setContentCmt] = useState("");
  const [isReplyMode, setIsReplyMode] = useState(false);
  const textareaRef = useRef(null);

  const dispatch = useDispatch();
  const totalLikes = useSelector((state) => state.likes.totalLikes);
  const totalLikesComment = useSelector((state) => state.comments.totalComent);
  const replyLikes = useSelector((state) => state.replyLikes.totalReply);

  const [countComment, setCountComment] = useState([]);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const [Stories, setStories] = useState([]);
  const navigate = useNavigate();
  const [previewUrl, setPreviewUrl] = useState("");
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileName = file.name;
      const previewUrl = URL.createObjectURL(file);

      setImage(file);
      setFileName(fileName);
      setPreviewUrl(previewUrl);

      return () => URL.revokeObjectURL(previewUrl);
    }
  };

  let settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
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

  const getPostAPI = useCallback(async () => {
    try {
      let res = await getPostOneUsers(params.id);
      if (res && res.data && res.data.data && res.status === 200) {
        setData(res.data.data);
      } else {
        setData([]);
        console.warn("Không có bài viết nào được trả về từ API");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API getPostOneUsers:", error);
      setData([]);
      toast.error("Không thể tải bài viết. Vui lòng thử lại sau!");
    }
  }, [params.id]);

  useEffect(() => {
    getPostAPI();
  }, [getPostAPI]);

  const getTimeAgoInMinutes = (postTime) => {
    const now = new Date();
    const postDate = new Date(postTime);
    const diffInMilliseconds = now - postDate;
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));

    if (diffInMinutes === 0) {
      return `vừa xong`;
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`;
    } else if (diffInMinutes < 1440) {
      const diffInHours = Math.floor(diffInMinutes / 60);
      return `${diffInHours} giờ trước`;
    } else {
      const diffInDays = Math.floor(diffInMinutes / 1440);
      return `${diffInDays} ngày trước`;
    }
  };

  useEffect(() => {
    const postIds = data.map((item) => item._id).join(",");
    if (postIds && data.length > 0) {
      dispatch(fetchLikesCount(postIds));
    }
  }, [data, dispatch]);

  useEffect(() => {
    const commentId = comments.map((item) => item._id).join(",");
    if (commentId && comments.length > 0) {
      dispatch(fetchLikesCountComment(commentId));
    }
  }, [comments, dispatch]);

  useEffect(() => {
    const replyIds = comments
      .map((item) => item.replies?.map((reply) => reply._id) || [])
      .flat()
      .filter((replyId) => replyId !== undefined)
      .join(",");
    if (replyIds && comments.length > 0) {
      dispatch(fetchLikesCountReply(replyIds));
    }
  }, [comments, dispatch]);

  const likesMap = totalLikes.reduce((acc, like) => {
    const postId = like._id;
    if (postId) {
      acc[postId] = like.totalLikes;
    }
    return acc;
  }, {});

  const likesMapComment = totalLikesComment.reduce((acc, like) => {
    const postId = like._id;
    if (postId) {
      acc[postId] = like.totalLikes;
    }
    return acc;
  }, {});

  const likeMapReply = replyLikes.reduce((acc, like) => {
    const replyId = like._id;
    if (replyId) {
      acc[replyId] = like.totalLikes;
    }
    return acc;
  }, {});

  const [selectedReaction, setSelectedReaction] = useState("like");

  const handleClickLike = async (_id, authorId, reaction) => {
    let res = await postLikeFromAPI(_id, authorId, userId, reaction);
    setSelectedReaction(reaction);
  };

  const handleClickCommentLike = async (_id, authorId, reaction) => {
    try {
      setSelectedReaction(reaction);
      let res = await postCommentLikes(_id, authorId, userId, reaction);
      if (res && res.success) {
        FetchGetComment();
      } else {
        setSelectedReaction(null);
        console.error("Failed to post reaction");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setSelectedReaction(null);
    }
  };

  const getReactionIcon = (reaction) => {
    switch (reaction) {
      case "like":
        return <AiOutlineLike size={20} height={20} color="#4267B2" />;
      case "love":
        return <FaHeart size={20} className="text-[#F33E58] font-bold" />;
      case "thương thương":
        return (
          <FaRegFaceGrinHearts
            size={20}
            height={20}
            className="text-[rgb(247,177,37)] font-bold"
          />
        );
      case "haha":
        return (
          <FaRegLaughSquint
            size={20}
            height={20}
            className="text-[rgb(247,177,37)] font-bold"
          />
        );
      case "wow":
        return (
          <FaRegFaceSurprise
            size={20}
            height={20}
            className="text-[rgb(247,177,37)] font-bold"
          />
        );
      case "sad":
        return (
          <FaRegFaceSadTear
            size={20}
            height={20}
            className="text-[rgb(247,177,37)] font-bold"
          />
        );
      case "angry":
        return (
          <FaRegFaceTired
            size={20}
            height={20}
            className="text-[rgb(233,113,15)] font-bold"
          />
        );
      default:
        return <AiOutlineLike size={20} className="text-gray-600" />;
    }
  };

  const getReactionIcon1 = (reaction) => {
    switch (reaction) {
      case "like":
        return <span className="text-[rgb(8,102,255)] font-bold">Thích</span>;
      case "love":
        return (
          <span className="text-[rgb(243,62,88)] font-bold">Yêu thích</span>
        );
      case "thương thương":
        return (
          <span className="text-[rgb(247,177,37)] font-bold">
            Thương thương
          </span>
        );
      case "haha":
        return <span className="text-[rgb(247,177,37)] font-bold">Haha</span>;
      case "wow":
        return <span className="text-[rgb(247,177,37)] font-bold">Wow</span>;
      case "sad":
        return <span className="text-[rgb(247,177,37)] font-bold">Buồn</span>;
      case "angry":
        return (
          <span className="text-[rgb(233,113,15)] font-bold">Phẫn Nộ</span>
        );
      default:
        return <span className="like">Thích</span>;
    }
  };

  const getReactionLabel = (reaction) => {
    switch (reaction) {
      case "like":
        return "Thích";
      case "love":
        return "Yêu thích";
      case "thương thương":
        return "Thương thương";
      case "haha":
        return "HaHa";
      case "wow":
        return "Wow";
      case "sad":
        return "Buồn";
      case "angry":
        return "Giận dữ";
      default:
        return "Khác";
    }
  };

  const renderUsersByReaction = (likes) => {
    const reactionsGrouped = groupUsersByReaction(likes);

    return Object.keys(reactionsGrouped).map((reaction) => (
      <div key={reaction} className="reaction-group">
        <div className="reaction-container">
          <span className="reaction-icon">{getReactionIcon(reaction)}</span>
          <div className="user-list">
            <span className="reaction-label text-[#fff] whitespace-nowrap">
              {getReactionLabel(reaction)}
            </span>
            {(reactionsGrouped[reaction] || []).map((user, index) => (
              <div key={index} className="user-name">
                <span>{user.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ));
  };

  const groupUsersByReaction = (likes) => {
    const grouped = likes.reduce((acc, like) => {
      if (like.userId && like.userId.profile) {
        const userName = like.userId.profile.name;
        const reaction = like.reaction || "Unknown";
        if (!acc[reaction]) {
          acc[reaction] = [];
        }
        if (!acc[reaction].some((user) => user.name === userName)) {
          acc[reaction].push({ name: userName });
        }
      }
      return acc;
    }, {});
    return grouped;
  };

  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const FetchGetComment = useCallback(async () => {
    try {
      let res = await getCommentsAPI();
      if (res && res.status === 200) {
        setComments(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleContentChange = (index, value) => {
    const newContents = [...contents];
    newContents[index] = value;
    setContents(newContents);
  };

  const sensitiveWords = sensitiveWordsData.sensitiveWords;

  const checkSensitiveContent = (contents) => {
    let lowerCaseComment = "";
    if (Array.isArray(contents)) {
      lowerCaseComment = contents.join(" ").toLowerCase();
    } else if (typeof contents === "string") {
      lowerCaseComment = contents.toLowerCase();
    } else {
      return false;
    }
    for (let word of sensitiveWords) {
      if (lowerCaseComment.includes(word.toLowerCase())) {
        return true;
      }
    }
    return false;
  };

  const handleComment = async (postId) => {
    if (checkSensitiveContent(contents)) {
      setContents(Array(data.length).fill(""));
      toast.error("Bình luận của bạn chứa nội dung không phù hợp!");
      return;
    }
    setLoading(true);
    try {
      const validContents = contents.filter(
        (content) => content && content.trim() !== ""
      );
      if (validContents.length === 0) {
        toast.error("Vui lòng nhập bình luận hợp lệ");
        return;
      }
      let data = await CreateCommentsAPI(postId, userId, validContents, image);
      if (data) {
        setContents(Array(data.length).fill(""));
        setImage(null);
        setPreviewUrl("");
        FetchGetComment();
      } else {
        toast.error("Bình luận bị lỗi");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    FetchGetComment();
  }, [FetchGetComment]);

  const handleChangeEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleComment();
    }
  };

  const getCountComment = useCallback(async () => {
    if (comments.length === 0) return;
    try {
      const postIds = comments.map((item) => item.postId);
      let res = await getCountComments(postIds);
      if (res && res.data.data) {
        setCountComment(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching comment count:", error);
    }
  }, [comments]);

  useEffect(() => {
    if (shouldRefetch) {
      FetchGetComment();
      getCountComment();
      setShouldRefetch(false);
    }
  }, [shouldRefetch, FetchGetComment, getCountComment]);

  useEffect(() => {
    getCountComment();
  }, [getCountComment]);

  useEffect(() => {
    if (isReplyMode) {
      textareaRef.current.focus();
    }
  }, [isReplyMode]);

  const handleFocus = () => {
    if (!isReplyMode) {
      setIsReplyMode(true);
      setContentCmt(`${showName} `);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setContentCmt(value);
  };

  const handleBlur = () => {
    if (contentCmt.trim() === "" || contentCmt.trim() === showName) {
      setIsReplyMode(false);
      setContentCmt("");
    }
  };

  const hanldeChanleReplie = (authorName, authorId, cmtId, postId) => {
    setShowName(authorName);
    setShowID(authorId);
    setShowCmt(cmtId);
    setShowPostID(postId);
    setShowReplie(true);
  };

  const handleReplieCmt = async (showPostID) => {
    if (checkSensitiveContent(contentCmt)) {
      setContentCmt("");
      toast.error("Bình luận của bạn chứa nội dung không phù hợp!");
      return;
    }
    setLoading(true);
    try {
      let data = await postReplyComment(
        showCmt,
        showID,
        showPostID,
        username,
        avatar,
        contentCmt,
        image,
        showID,
        userId
      );
      if (data) {
        toast.success("Phản hồi thành công");
        setContentCmt("");
        setImage(null);
        setPreviewUrl("");
        FetchGetComment();
        setShouldRefetch(true);
      } else {
        toast.error("Bình luận bị lỗi");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const postLikeCommentReplyAPI = async (
    _id,
    authorId,
    userId,
    reaction,
    replyId
  ) => {
    try {
      const data = await postLikeCommentReply(
        _id,
        authorId,
        userId,
        reaction,
        replyId
      );
      if (data && data.data.EC === 0) {
        setSelectedReaction(reaction);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAPIStories = async () => {
    try {
      let res = await GetAllStoriesAPIFB();
      if (res && res.data && res.data.EC === 0) {
        setStories(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAPIStories();
  }, []);

  const [currentSlide, setCurrentSlide] = useState(0);

  const updatedSettings = {
    ...settings,
    beforeChange: (current, next) => {
      setCurrentSlide(next);
      if (settings.beforeChange) {
        settings.beforeChange(current, next);
      }
    },
  };

  const usernameFriends = profile?.profile?.name;
  localStorage.setItem("name_friend", usernameFriends);

  return (
    <div className="slider-container_profile">
      {userId === params.id ? (
        <div
          className={`content_status ${
            isDarkMode
              ? "bg-[rgba(16,17,18,1)]"
              : "bg-[#ffffff] border border-[#ddd]"
          } m-auto text-center h-32`}
        >
          <div className="w-full flex items-center gap-4 ml-4 bottom_text mt-5">
            <img
              src={avatar ? avatar : avtart}
              alt="lỗi"
              className="image_status"
            />
            <Status
              showModal={showModal}
              setShowModal={setShowModal}
              getPostAPI={getPostAPI}
              data={data}
              setData={setData}
              fetchCountNotification={fetchCountNotification}
              isDarkMode={isDarkMode}
              usernameFriends={usernameFriends}
            />
          </div>
          <div className={`live flex justify-between pt-12 ml-3`}>
            <div className="w-full flex justify-between items-center -mt-10 cursor-pointer">
              <div className="flex items-center justify-center gap-2">
                <MdVideoCameraFront className="size-8 text-red-800" />
                <span className={isDarkMode ? "text-[#fff]" : "text-[#333]"}>
                  Video Trực Tiếp
                </span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <BsFillFileImageFill className="size-8 text-green-800" />
                <span className={isDarkMode ? "text-[#fff]" : "text-[#333]"}>
                  Ảnh/Video
                </span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <MdInsertEmoticon className="size-8 text-yellow-400" />
                <span className={isDarkMode ? "text-[#fff]" : "text-[#333]"}>
                  Cảm xúc hoạt động
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`content_status ${
            isDarkMode
              ? "bg-[rgba(16,17,18,1)]"
              : "bg-[#ffffff] border border-[#ddd]"
          } m-auto text-center h-32`}
        >
          <div className="w-full flex items-center gap-4 ml-4 bottom_text mt-5">
            <img
              src={avatar ? avatar : avtart}
              alt="lỗi"
              className="image_status"
            />
            <Status
              showModal={showModal}
              setShowModal={setShowModal}
              getPostAPI={getPostAPI}
              data={data}
              setData={setData}
              fetchCountNotification={fetchCountNotification}
              isDarkMode={isDarkMode}
              params={params}
            />
          </div>
          <div className={`live flex justify-between pt-12 ml-3`}>
            <div className="w-full flex justify-between items-center -mt-10 cursor-pointer">
              <div className="flex items-center justify-center gap-2">
                <MdVideoCameraFront className="size-8 text-red-800" />
                <span className={isDarkMode ? "text-[#fff]" : "text-[#333]"}>
                  Video Trực Tiếp
                </span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <BsFillFileImageFill className="size-8 text-green-800" />
                <span className={isDarkMode ? "text-[#fff]" : "text-[#333]"}>
                  Ảnh/Video
                </span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <MdInsertEmoticon className="size-8 text-yellow-400" />
                <span className={isDarkMode ? "text-[#fff]" : "text-[#333]"}>
                  Cảm xúc hoạt động
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {data && data.length > 0 ? (
        data.map((item, index) => {
          const userReaction = item.likes.find(
            (like) => like.userId && like.userId._id === userId
          )?.reaction;

          return (
            <div
              className={`${
                isDarkMode
                  ? "bg-[rgba(16,17,18,1)]"
                  : "bg-[#ffffff] border border-[#ddd]"
              } content_status m-auto mt-5 min-h-max p-5`}
              key={item._id}
            >
              <div className="post flex items-center justify-between m-4 -mt-5 pt-2">
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
              <div className="grid gap-2 w-full">
                {item.image && (
                  <div
                    className={`grid ${
                      item.image.length === 1 ? "" : "grid-cols-2"
                    } gap-2`}
                  >
                    {item.image.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Ảnh ${index + 1}`}
                        className={`w-full h-full object-cover rounded-lg ${
                          item.image.length === 1 ? "col-span-2" : ""
                        }`}
                      />
                    ))}
                  </div>
                )}
                {item.video && (
                  <video
                    controls
                    loop
                    className={`w-full rounded-lg ${
                      item.image?.length === 1 ? "h-full" : "h-64"
                    }`}
                  >
                    <source src={item.video} type="video/mp4" />
                  </video>
                )}
              </div>

              <div className="w-full h-8 like relative top-3 flex items-center">
                <div className="flex items-center mt-3">
                  <span className="flex items-center">
                    {renderUsersByReaction(item.likes)}
                  </span>
                  <div className="-mt-4 ml-2">
                    {likesMap[item._id] ? `${likesMap[item._id]} ` : "0"}
                  </div>
                </div>
                <div className="w-full flex justify-end items-center -mt-2">
                  <div className="pr-10 flex items-center g-2 cursor-pointer comment_par">
                    {countComment && countComment.length > 0 && (
                      <span>
                        {
                          countComment.find(
                            (count) => count.postId === item._id
                          )?.totalUniqueCommenters
                        }
                      </span>
                    )}
                    <FaRegComment size={20} color="gray" className="ml-1" />
                    {Array.isArray(countComment) &&
                      countComment.length > 0 &&
                      countComment
                        .filter((itemId) => itemId.postId === item._id)
                        .map((itemId, index) => (
                          <div
                            className="mt-20 absolute text-nowrap comment_hover text-white"
                            key={itemId.postId}
                          >
                            {Array.isArray(itemId.commenters) &&
                              itemId.commenters.map((cmt, index) => (
                                <div key={index}>
                                  <span>{cmt.name}</span>
                                </div>
                              ))}
                          </div>
                        ))}
                  </div>
                  <span>
                    <PiShareFatThin size={20} color="gray" />
                  </span>
                </div>
              </div>
              <div className="w-4/5 m-auto pr-2 flex justify-between items-center mt-5 cursor-pointer">
                <div className="hover_icon">
                  <span
                    className="flex gap-1 items-center cursor-pointer"
                    onClick={() =>
                      handleClickLike(item._id, item.authorId, "like")
                    }
                  >
                    {userReaction ? (
                      getReactionIcon(userReaction)
                    ) : (
                      <>
                        <AiOutlineLike className="text-gray-600" />
                        Thích
                      </>
                    )}
                  </span>
                  <div className="laugh-icon flex items-center gap-5 absolute">
                    <span className="icon-animation">
                      <AiOutlineLike
                        size={30}
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
                      <FaHeart size={30} color="red" />
                    </span>
                    <span className="icon-animation">
                      <FaRegFaceGrinHearts
                        size={30}
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
                        size={30}
                        color="orange"
                        onClick={() =>
                          handleClickLike(item._id, item.authorId, "haha")
                        }
                      />
                    </span>
                    <span className="icon-animation">
                      <FaRegFaceSurprise
                        size={30}
                        color="orange"
                        onClick={() =>
                          handleClickLike(item._id, item.authorId, "wow")
                        }
                      />
                    </span>
                    <span className="icon-animation">
                      <FaRegFaceSadTear
                        size={30}
                        color="orange"
                        onClick={() =>
                          handleClickLike(item._id, item.authorId, "sad")
                        }
                      />
                    </span>
                    <span className="icon-animation">
                      <FaRegFaceTired
                        size={30}
                        color="orange"
                        onClick={() =>
                          handleClickLike(item._id, item.authorId, "angry")
                        }
                      />
                    </span>
                  </div>
                </div>
                <span className="flex gap-1 items-center cursor-pointer">
                  <FaRegComment />
                  Bình Luận
                </span>
                <span className="flex items-center gap-1 cursor-pointer">
                  <PiShareFatThin />
                  Chia Sẻ
                </span>
              </div>
              <div className="comment_post">
                {comments.length > 0 ? (
                  comments.map((comment, index) => {
                    const userReaction1 = comment.likes.find(
                      (like) => like.userId && like.userId._id === userId
                    )?.reaction;

                    if (comment.postId === item._id) {
                      return (
                        <>
                          <div
                            key={comment._id}
                            className="flex items-center gap-1"
                          >
                            <img
                              className="w-10 h-10 rounded-full -mt-7"
                              src={comment.avatar}
                              alt="avart lỗi"
                            />
                            <div className="block ml-1">
                              <div className="comment_bg mt-4">
                                <span>{comment.authorName}</span>
                                <p>{comment.content}</p>
                                {comment.image && (
                                  <img
                                    className="w-32 h-32 object-cover rounded-lg"
                                    src={comment.image}
                                    alt="ảnh bình luận"
                                  />
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1 comments_like">
                                <span className="comment_text">
                                  {getTimeAgoInMinutes(comment.createdAt)}
                                </span>
                                <div className="comment_text like_hover">
                                  <span
                                    onClick={() =>
                                      handleClickCommentLike(
                                        comment._id,
                                        comment.authorId,
                                        "like"
                                      )
                                    }
                                  >
                                    {userReaction1 ? (
                                      getReactionIcon1(userReaction1)
                                    ) : (
                                      <>Thích</>
                                    )}
                                  </span>
                                  <div className="laugh-icon flex items-center gap-5 absolute">
                                    <span className="icon-animation">
                                      <AiOutlineLike
                                        size={30}
                                        color="blue"
                                        onClick={() =>
                                          handleClickCommentLike(
                                            comment._id,
                                            comment.authorId,
                                            "like"
                                          )
                                        }
                                      />
                                    </span>
                                    <span
                                      className="icon-animation"
                                      onClick={() =>
                                        handleClickCommentLike(
                                          comment._id,
                                          comment.authorId,
                                          "love"
                                        )
                                      }
                                    >
                                      <FaHeart size={30} color="red" />
                                    </span>
                                    <span className="icon-animation">
                                      <FaRegFaceGrinHearts
                                        size={30}
                                        color="orange"
                                        onClick={() =>
                                          handleClickCommentLike(
                                            comment._id,
                                            comment.authorId,
                                            "thương thương"
                                          )
                                        }
                                      />
                                    </span>
                                    <span className="icon-animation">
                                      <FaRegLaughSquint
                                        size={30}
                                        color="orange"
                                        onClick={() =>
                                          handleClickCommentLike(
                                            comment._id,
                                            comment.authorId,
                                            "haha"
                                          )
                                        }
                                      />
                                    </span>
                                    <span className="icon-animation">
                                      <FaRegFaceSurprise
                                        size={30}
                                        color="orange"
                                        onClick={() =>
                                          handleClickCommentLike(
                                            comment._id,
                                            comment.authorId,
                                            "wow"
                                          )
                                        }
                                      />
                                    </span>
                                    <span className="icon-animation">
                                      <FaRegFaceSadTear
                                        size={30}
                                        color="orange"
                                        onClick={() =>
                                          handleClickCommentLike(
                                            comment._id,
                                            comment.authorId,
                                            "sad"
                                          )
                                        }
                                      />
                                    </span>
                                    <span className="icon-animation">
                                      <FaRegFaceTired
                                        size={30}
                                        color="orange"
                                        onClick={() =>
                                          handleClickCommentLike(
                                            comment._id,
                                            comment.authorId,
                                            "angry"
                                          )
                                        }
                                      />
                                    </span>
                                  </div>
                                </div>
                                <div
                                  className="comment_text"
                                  onClick={() =>
                                    hanldeChanleReplie(
                                      comment.authorName,
                                      comment.authorId,
                                      comment._id,
                                      comment.postId
                                    )
                                  }
                                >
                                  Phản hồi
                                </div>
                                <div className="comment_text flex items-center gap-2">
                                  {renderUsersByReaction(comment.likes)}
                                  {likesMapComment[comment._id]
                                    ? `${likesMapComment[comment._id]} `
                                    : "0"}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="block reply_item">
                            {comment.replies &&
                              comment.replies.length > 0 &&
                              comment.replies.map((replie) => {
                                const userReaction2 = replie.likes.find(
                                  (like) => like.userId._id === userId
                                )?.reaction;

                                return (
                                  <div
                                    key={replie._id}
                                    className="flex items-center gap-1"
                                  >
                                    <img
                                      className="w-10 h-10 rounded-full -mt-7"
                                      src={replie.avatar}
                                      alt="avart lỗi"
                                    />
                                    <div className="block ml-1">
                                      <div className="comment_bg mt-4">
                                        <span>{replie.authorName}</span>
                                        <p>{replie.content}</p>
                                        {replie.image && (
                                          <img
                                            className="w-32 h-32 object-cover rounded-lg"
                                            src={replie.image}
                                            alt="ảnh bình luận"
                                          />
                                        )}
                                      </div>
                                      <div className="flex items-center gap-2 mt-1 comments_like">
                                        <span className="comment_text">
                                          {getTimeAgoInMinutes(
                                            replie.createdAt
                                          )}
                                        </span>
                                        <div className="comment_text like_hover">
                                          <span
                                            onClick={() =>
                                              postLikeCommentReplyAPI(
                                                comment._id,
                                                replie.authorId,
                                                userId,
                                                "like",
                                                replie._id
                                              )
                                            }
                                          >
                                            {userReaction2 ? (
                                              getReactionIcon1(userReaction2)
                                            ) : (
                                              <>Thích</>
                                            )}
                                          </span>
                                          <div className="laugh-icon flex items-center gap-5 absolute">
                                            <span className="icon-animation">
                                              <AiOutlineLike
                                                size={30}
                                                color="blue"
                                                onClick={() =>
                                                  postLikeCommentReplyAPI(
                                                    comment._id,
                                                    replie.authorId,
                                                    userId,
                                                    "like",
                                                    replie._id
                                                  )
                                                }
                                              />
                                            </span>
                                            <span
                                              className="icon-animation"
                                              onClick={() =>
                                                postLikeCommentReplyAPI(
                                                  comment._id,
                                                  replie.authorId,
                                                  userId,
                                                  "love",
                                                  replie._id
                                                )
                                              }
                                            >
                                              <FaHeart size={30} color="red" />
                                            </span>
                                            <span className="icon-animation">
                                              <FaRegFaceGrinHearts
                                                size={30}
                                                color="orange"
                                                onClick={() =>
                                                  postLikeCommentReplyAPI(
                                                    comment._id,
                                                    replie.authorId,
                                                    userId,
                                                    "thương thương",
                                                    replie._id
                                                  )
                                                }
                                              />
                                            </span>
                                            <span className="icon-animation">
                                              <FaRegLaughSquint
                                                size={30}
                                                color="orange"
                                                onClick={() =>
                                                  postLikeCommentReplyAPI(
                                                    comment._id,
                                                    replie.authorId,
                                                    userId,
                                                    "haha",
                                                    replie._id
                                                  )
                                                }
                                              />
                                            </span>
                                            <span className="icon-animation">
                                              <FaRegFaceSurprise
                                                size={30}
                                                color="orange"
                                                onClick={() =>
                                                  postLikeCommentReplyAPI(
                                                    comment._id,
                                                    replie.authorId,
                                                    userId,
                                                    "wow",
                                                    replie._id
                                                  )
                                                }
                                              />
                                            </span>
                                            <span className="icon-animation">
                                              <FaRegFaceSadTear
                                                size={30}
                                                color="orange"
                                                onClick={() =>
                                                  postLikeCommentReplyAPI(
                                                    comment._id,
                                                    replie.authorId,
                                                    userId,
                                                    "sad",
                                                    replie._id
                                                  )
                                                }
                                              />
                                            </span>
                                            <span className="icon-animation">
                                              <FaRegFaceTired
                                                size={30}
                                                color="orange"
                                                onClick={() =>
                                                  postLikeCommentReplyAPI(
                                                    comment._id,
                                                    replie.authorId,
                                                    userId,
                                                    "angry",
                                                    replie._id
                                                  )
                                                }
                                              />
                                            </span>
                                          </div>
                                        </div>
                                        <div
                                          className="comment_text"
                                          onClick={() =>
                                            hanldeChanleReplie(
                                              replie.authorName,
                                              replie.authorId,
                                              comment._id,
                                              comment.postId
                                            )
                                          }
                                        >
                                          Phản hồi
                                        </div>
                                        <div className="comment_text flex items-center gap-2">
                                          {renderUsersByReaction(replie.likes)}
                                          {likeMapReply[replie._id]
                                            ? `${likeMapReply[replie._id]} `
                                            : "0"}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}

                            {showReplie && showCmt === comment._id && (
                              <div className="flex items-center px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-100 mt-3 reply_content">
                                <button
                                  onClick={handleClick}
                                  type="button"
                                  className="inline-flex justify-center p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                                >
                                  <svg
                                    className="w-5 h-5"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 18"
                                  >
                                    <path
                                      fill="currentColor"
                                      d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z"
                                    />
                                    <path
                                      stroke="currentColor"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M18 1H2a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"
                                    />
                                    <path
                                      stroke="currentColor"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z"
                                    />
                                  </svg>
                                  <span className="sr-only">Upload image</span>
                                </button>
                                <input
                                  type="file"
                                  ref={fileInputRef}
                                  onChange={handleFileChange}
                                  style={{ display: "none" }}
                                />
                                <button
                                  type="button"
                                  className="p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                                >
                                  <svg
                                    className="w-5 h-5"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      stroke="currentColor"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M13.408 7.5h.01m-6.876 0h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM4.6 11a5.5 5.5 0 0 0 10.81 0H4.6Z"
                                    />
                                  </svg>
                                  <span className="sr-only">Add emoji</span>
                                </button>
                                <textarea
                                  ref={textareaRef}
                                  rows={1}
                                  className="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 dark:bg-white dark:placeholder-gray-400 dark:text-[#333] focus:bg-white outline-none"
                                  onFocus={handleFocus}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={contentCmt}
                                  placeholder={
                                    isReplyMode ? "" : "Câu phản hồi của"
                                  }
                                />
                                <button
                                  onClick={() => handleReplieCmt(showPostID)}
                                  className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
                                >
                                  <svg
                                    className="w-5 h-5 rotate-90 rtl:-rotate-90"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 18 20"
                                  >
                                    <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
                                  </svg>
                                  <span className="sr-only">Send message</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </>
                      );
                    } else {
                      return null;
                    }
                  })
                ) : (
                  <p>Không có bình luận</p>
                )}

                <label htmlFor="chat" className="sr-only">
                  Your message
                </label>
                <div className="relative flex items-center px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-100 mt-3 min-h-14 flex-wrap">
                  <button
                    onClick={handleClick}
                    type="button"
                    className="inline-flex justify-center p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                  >
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 18"
                    >
                      <path
                        fill="currentColor"
                        d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z"
                      />
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18 1H2a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"
                      />
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z"
                      />
                    </svg>
                    <span className="sr-only">Upload image</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  <button
                    type="button"
                    className="p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                  >
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.408 7.5h.01m-6.876 0h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM4.6 11a5.5 5.5 0 0 0 10.81 0H4.6Z"
                      />
                    </svg>
                    <span className="sr-only">Add emoji</span>
                  </button>
                  <div className="flex-1 flex items-center">
                    <textarea
                      id={`chat-${index}`}
                      key={index + 1}
                      rows={1}
                      className="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 dark:bg-white dark:placeholder-gray-400 dark:text-[#333] focus:bg-white outline-none"
                      placeholder={`Bình luận dưới tên là ${username}`}
                      onChange={(e) =>
                        handleContentChange(index, e.target.value)
                      }
                      value={contents[index]}
                      onKeyDown={handleChangeEnter}
                    />
                    <button
                      onClick={() => handleComment(item._id)}
                      className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
                    >
                      <svg
                        className="w-5 h-5 rotate-90 rtl:-rotate-90"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 18 20"
                      >
                        <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
                      </svg>
                      <span className="sr-only">Send message</span>
                    </button>
                  </div>
                  <div className="img_post flex items-center w-full mt-2">
                    {previewUrl && (
                      <img
                        className="rounded-lg object-cover"
                        style={{ width: "100px", height: "100px" }}
                        src={previewUrl}
                        alt={fileName}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-center mt-5">Không có bài viết nào để hiển thị.</p>
      )}
    </div>
  );
};

export default Main;
