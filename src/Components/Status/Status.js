import React, { useEffect, useState } from "react";
import "./Status.scss";
import { PostCreateNew } from "../../service/apiAxios";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
export default function Status({ showModal, setShowModal, getPostAPI }) {
  const authorId = localStorage.getItem("id");

  let [content, setContent] = useState("");
  let [image, setImage] = useState(null);
  let [video, setVideo] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [previewVideo, setPreviewVideo] = useState("");
  const [isCheckVideo, seIsCheckVideo] = useState(false);
  const [isCheckImage, seIsCheckImage] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const handleChanFile = (e) => {
    if (e.target && e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.type.startsWith("image/")) {
        setImage(file);
        setPreviewImage(URL.createObjectURL(file));
        seIsCheckImage(true);
        setVideo(null); // Reset video nếu trước đó đã chọn
      } else if (file.type.startsWith("video/")) {
        setVideo(file);
        setPreviewVideo(URL.createObjectURL(file));
        setImage(null); // Reset ảnh nếu trước đó đã chọn
        seIsCheckVideo(true); // Hiển thị preview cho video
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
        setImage("");
        setPreviewImage();
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const handleHidenModel = () => {
    setShowModal(false);
    setContent("");
    setImage("");
    setPreviewImage();
    setPreviewVideo();
    seIsCheckVideo(false);
    seIsCheckImage(false);
  };
  useEffect(() => {
    getPostAPI();
  }, [APICreatePost]);
  return (
    <>
      <button
        className="p-3 w-4/5 btn_title text-[#333] font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
        type="button"
        onClick={() => setShowModal(true)}
      >
        <span className="mt-2 "> Anh bạn đang nghĩ gì thế ? </span>
      </button>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none  ">
            <div className="relative  my-6 mx-auto max-w-md w-4/5">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none w">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t ">
                  <h3 className="text-3xl font-semibold text-center">
                    Tạo Bài Viết
                  </h3>
                  <button
                    className="my-circle p-2 ml-auto border-0 text-gray-700 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => handleHidenModel()}
                  >
                    X
                  </button>
                </div>
                {/*body*/}
                <div className="p-2 flex-auto w-full h-2/3 m-auto">
                  <textarea
                    className="w-2/4 h-auto resize-none text-center placeholder:text-center placeholder-align"
                    rows="4"
                    placeholder="Anh ơi, bạn đang nghĩ gì thế?"
                    onChange={(e) => setContent(e.target.value)}
                    value={content}
                  ></textarea>

                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer   "
                    >
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
                      {isCheckImage && previewImage && (
                        <img
                          src={previewImage}
                          className="w-full h-full object-cover"
                          alt="anh loi"
                        />
                      )}
                      <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        onChange={(e) => handleChanFile(e)}
                      />
                      {isCheckVideo === false && isCheckImage === false && (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">
                              Thêm ảnh hoặc kéo thẻ
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            SVG, PNG, JPG or GIF (MAX. 800x400px)
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
                {/*footer*/}
                <div className="flex items-center  p-6 border-t border-solid border-blueGray-200 rounded-b">
                  {/* <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button> */}
                  <button
                    className=" w-full bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    // onClick={() => setShowModal(false)}
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
