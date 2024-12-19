import { IoMdContact } from "react-icons/io";
import "./stories.css";
import {
  CloseOutlined,
  SettingOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import { Button, Modal, Select } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import { toast } from "react-toastify";
import { CreateStoriesApiFB } from "../../service/apiAxios";

const Stories = () => {
  const name = localStorage.getItem("name");
  const avatar = localStorage.getItem("avatar");
  const [hiddenImage, setHiddenImage] = useState(false);
  const [hiddenText, setHiddenText] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [open, setOpen] = useState(false);
  const [optionText, setOptionText] = useState("Bình Thường");
  const [fontStyle, setFontStyle] = useState("sans-serif");

  // api
  const [content, setContent] = useState("");
  const [images, setImages] = useState(null);
  const [video, setVideo] = useState(null);
  const [visibility, setVisibility] = useState("public");
  const authorId = localStorage.getItem("id");
  const handleOnChangeFile = (e) => {
    const file = e.target.files[0];

    if (file.type.startsWith("image/")) {
      setImages(file);
      setPreviewImage(URL.createObjectURL(file));
      setHiddenImage(true);
      // setVideo(null); // Reset video nếu trước đó đã chọn
    } else if (file.type.startsWith("video/")) {
      // setVideo(file);
      // setPreviewVideo(URL.createObjectURL(file));
      // setImage(null); // Reset ảnh nếu trước đó đã chọn
      // seIsCheckVideo(true); // Hiển thị preview cho video
    } else {
      toast.error("Chỉ hỗ trợ định dạng ảnh hoặc video!");
    }
  };
  const onChange = (e) => {
    console.log("Change:", e.target.value);
    setContent(e.target.value);
  };
  const HandleModal = () => {
    setOpen(true);
  };

  const handleCancleModal = () => {
    setOpen(false);
    setHiddenImage(false);
    setHiddenText(false);
  };

  const handleChange = (value) => {
    setOptionText(value.label);
    setFontStyle(value.value);
  };

  const options = [
    { label: "Gọn Gàng", value: "sans-serif" },
    { label: "Bình Thường", value: "serif" },
    { label: "Kiểu Cách", value: "cursive" },
    { label: "Tiêu Đề", value: "monospace" },
  ];

  const HandleBtnStories = async () => {
    try {
      const res = await CreateStoriesApiFB(
        authorId,
        content,
        images,
        video,
        visibility
      );
      console.log(res);

      if (res && res.data && res.data.success === true) {
        toast.success("Tạo tin thành công");
        setContent("");
        setHiddenText(false);
      }
    } catch (error) {}
  };

  return (
    <div className="stories flex h-full relative">
      <div className="stories_left w-1/4 h-full absolute bg-[#252728]">
        <div className="w-full h-14 close">
          <span className="close-icon">
            <Link className="w-full text-center" to="/">
              <CloseOutlined className="customer-icon" />
            </Link>
          </span>
        </div>

        <div className="w-full h-28 stories_main">
          <div className="flex justify-between items-center mx-5 mt-3">
            <h2 className="text-xl font-bold text-[#fff]">Tin của bạn</h2>
            <span className="w-10 h-10 bg-[#333] flex justify-center items-center rounded-full cursor-pointer">
              <SettingOutlined className="text-[#fff]" />
            </span>
          </div>
          <div className="flex items-center gap-5 mx-5 mt-2">
            {avatar ? (
              <div className="online_radium">
                <img
                  className="avatar h-10 object-cover rounded-full "
                  src={avatar}
                  alt="ảnh lỗi"
                />
              </div>
            ) : (
              <div className="border-icon ">
                <IoMdContact className="avatar" />
              </div>
            )}
            <div>
              <h3 className="text-[#fff] font-bold ">{name}</h3>
            </div>
          </div>
          {hiddenText && (
            <>
              <div className="w-full text_box mt-4 flex justify-center items-center">
                <TextArea
                  className=" paragraph placeholder-white "
                  style={{
                    textAlign: "left",
                    color: "#fff", // Nếu placeholder màu trắng
                  }}
                  value={content}
                  placeholder="Nhập văn bản"
                  onChange={(e) => onChange(e)}
                  autoSize={{
                    minRows: 3,
                    maxRows: 5,
                  }}
                />
              </div>
              <Select
                onChange={(value) =>
                  handleChange(options.find((option) => option.value === value))
                }
                defaultValue={optionText}
                style={{
                  width: "95%",
                  height: "60px",
                  margin: "auto",
                  marginTop: "20px",
                }}
                className="flex justify-center"
                options={options.map((option) => ({
                  label: option.label,
                  value: option.value,
                }))}
              />
            </>
          )}
          {(hiddenImage || hiddenText) && (
            <div
              className="w-full absolute bottom-0 flex gap-2 items-center justify-center h-16"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.3)",
              }}
            >
              <Button
                style={{
                  backgroundColor: "rgba(255, 255, 255, .1)",
                  outline: "none",
                  border: "none",
                  width: "30%",
                  height: "40px",
                }}
                onClick={HandleModal}
              >
                Bỏ tin
              </Button>
              <Button
                className="w-3/5 h-10"
                type="primary"
                onClick={HandleBtnStories}
              >
                Chia sẻ lên tin
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="stories_right w-9/12 h-full absolute right-0 bg-black flex justify-center items-center gap-6">
        {hiddenImage && (
          <div className="content_image flex flex-col justify-center items-center w-full h-[300px] sm:h-[400px] md:w-4/5 md:h-[600px] bg-[#252728] rounded-lg p-4">
            <p className="text-[#fff] font-medium mb-4">Xem trước</p>
            <div className="flex justify-center items-center w-[90%]  h-[80%] bg-black rounded-md">
              <img
                src={previewImage}
                alt="Preview"
                className="w-2/4 h-full object-cover rounded-md "
              />
            </div>
            <p className="text-[#fff] mt-4">Chọn ảnh để cắt và xoay</p>
          </div>
        )}

        {!hiddenImage && !hiddenText && (
          <>
            <div
              className="bg_stories relative"
              onClick={() => {
                document.getElementById("file_input").click();
              }}
            >
              <div className="flex justify-center items-center h-full">
                <input
                  type="file"
                  hidden
                  id="file_input"
                  onChange={handleOnChangeFile}
                />
                <label
                  htmlFor="file_input"
                  className="w-14 h-14 bg-black rounded-full flex justify-center"
                >
                  <FileImageOutlined className="file_image text-center text-4xl text-[#fff]" />
                </label>
              </div>
              <div className="text-[#ffff] w-full h-full absolute bottom-0 flex justify-center items-center top-12 left-0 text-center">
                <p className="font-bold">Tạo tin dạng ảnh</p>
              </div>
            </div>

            <div
              className="bg-stories_1 relative"
              onClick={() => setHiddenText(true)}
            >
              <div className="flex justify-center items-center h-full">
                <div className="w-14 h-14 bg-black rounded-full flex justify-center items-center">
                  <p className="text-[#fff] text-xl text-center">Aa</p>
                </div>
              </div>
              <div className="text-[#ffff] w-full h-full absolute bottom-0 flex justify-center items-center top-12 left-0 text-center">
                <p className="font-bold">Tạo tin bằng văn bản</p>
              </div>
            </div>
          </>
        )}

        {hiddenText && (
          <div className="content_image flex flex-col justify-center items-center w-full h-[300px] sm:h-[400px] md:w-4/5 md:h-[600px] bg-[#252728] rounded-lg p-4">
            <div className="flex justify-center items-center w-[90%]  h-[80%] bg-black rounded-md">
              <div className="Paratext_main">
                <div
                  className="w-full h-full text-center m-auto flex justify-center items-center font-bold text-2xl text-[#fff] uppercase"
                  style={{
                    wordBreak: "break-word",
                    fontFamily: fontStyle,
                  }}
                >
                  {content ? content : "BẮT ĐẦU NHẬP"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Modal
        title="Bỏ tin?"
        centered
        open={open}
        onOk={() => setOpen(false)}
        onCancel={handleCancleModal}
        width={500}
        okText="Tiếp tục chỉnh sửa"
        cancelText="Bỏ"
      >
        <p>
          Bạn có chắc chắn muốn bỏ tin này không? Hệ thống sẽ không lưu tin của
          bạn.
        </p>
      </Modal>
    </div>
  );
};

export default Stories;
