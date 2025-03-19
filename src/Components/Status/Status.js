import React, { useEffect, useState } from "react";
import "./Status.scss";
import { PostCreateNew } from "../../service/apiAxios";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";

export default function Status({
  showModal,
  setShowModal,
  getPostAPI,
  fetchCountNotification,
  isDarkMode,
  params,
  usernameFriends,
}) {
  const authorId = localStorage.getItem("id");

  const [content, setContent] = useState("");
  const [image, setImage] = useState([]);
  const [video, setVideo] = useState(null);
  const [previewImage, setPreviewImage] = useState([]);
  const [previewVideo, setPreviewVideo] = useState("");
  const [isCheckVideo, setIsCheckVideo] = useState(false);
  const [isCheckImage, setIsCheckImage] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const handleChanFile = (e) => {
    if (e.target && e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const imageFiles = files.filter((file) => file.type.startsWith("image/"));
      const videoFiles = files.filter((file) => file.type.startsWith("video/"));

      if (imageFiles.length > 0) {
        setImage((prevImages) => [...prevImages, ...imageFiles]); // Add new image files
        setPreviewImage((prevImages) => [
          ...prevImages,
          ...imageFiles.map((file) => URL.createObjectURL(file)),
        ]);
        setIsCheckImage(true);
        setVideo(null); // Reset video if an image is selected
      } else if (videoFiles.length > 0) {
        setVideo(videoFiles[0]);
        setPreviewVideo(URL.createObjectURL(videoFiles[0]));
        setImage([]); // Clear images if a video is selected
        setIsCheckVideo(true);
      } else {
        toast.error("Chỉ hỗ trợ định dạng ảnh hoặc video!");
      }
    }
  };

  const APICreatePost = async () => {
    setLoading(true);
    try {
      setTimeout(async () => {
        let res = await PostCreateNew(authorId, content, image, video);
        if (res && res.status === 201) {
          toast.success("Đăng bài thành công");
        } else {
          toast.error("Lỗi đăng bài");
        }
        setContent("");
        setImage([]);
        setPreviewImage([]);
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const handleHideModal = () => {
    setShowModal(false);
    setContent("");
    setImage([]);
    setPreviewImage([]);
    setPreviewVideo("");
    setIsCheckVideo(false);
    setIsCheckImage(false);
  };

  useEffect(() => {
    getPostAPI();
  }, [APICreatePost]);

  return (
    <>
      <button
        className={`${
          isDarkMode ? "bg-[#3A3B3C] text-[#fff]" : "bg-[#f0f2f5] text-[#333]"
        } p-3 w-4/5 btn_title font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`}
        type="button"
        onClick={() => setShowModal(true)}
      >
        <span className="mt-2">
          {params
            ? `Viết một cái gì đó cho ${localStorage.getItem("name_friend")} `
            : "Anh bạn đang nghĩ gì thế"}
        </span>
      </button>

      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative my-6 mx-auto max-w-md w-4/5">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold text-center">
                    Tạo Bài Viết
                  </h3>
                  <button
                    className="p-2 ml-auto border-0 text-gray-700 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => handleHideModal()}
                  >
                    X
                  </button>
                </div>
                <div className="p-2 flex-auto w-full h-2/3 m-auto">
                  <textarea
                    className="w-2/4 h-auto resize-none text-center placeholder:text-center placeholder-align"
                    rows="4"
                    placeholder={
                      params
                        ? `Viết một cái gì đó cho ${localStorage.getItem(
                            "name_friend"
                          )} `
                        : "Anh bạn đang nghĩ gì thế"
                    }
                    onChange={(e) => setContent(e.target.value)}
                    value={content}
                  ></textarea>

                  <div className="flex flex-col items-center w-full height_scroll overflow-y-scroll p-2">
                    {isCheckVideo && previewVideo && (
                      <video className="check_video" autoPlay muted loop>
                        <source
                          width="350x"
                          height="350px"
                          src={previewVideo}
                          type="video/mp4"
                        />
                      </video>
                    )}

                    {isCheckImage &&
                      previewImage.map((imageSrc, index) => (
                        <img
                          key={index}
                          src={imageSrc}
                          className="check_image"
                          alt={`preview-${index}`}
                        />
                      ))}

                    <label
                      htmlFor="dropzone-file"
                      className="flex items-center justify-center w-full h-12 bg-gray-200 rounded-md cursor-pointer mt-2"
                    >
                      <span className="text-gray-700 font-semibold">
                        + Thêm ảnh
                      </span>
                      <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        onChange={(e) => handleChanFile(e)}
                        multiple
                      />
                    </label>
                  </div>
                </div>
                <div className="flex items-center p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="w-full bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => APICreatePost()}
                  >
                    {isLoading ? (
                      <div className="loader-overlay">
                        <ClipLoader className="loader-wrapper" />
                      </div>
                    ) : (
                      "Đăng Bài Viết"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}
