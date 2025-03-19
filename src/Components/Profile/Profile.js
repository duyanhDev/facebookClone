import { useNavigate, useParams } from "react-router-dom";
import Main from "../MainProfile/Main";
import "./Profile.scss";
import { Button } from "antd";
import { FaHome } from "react-icons/fa";
import { getProfileUserAPI, updateIntroduce } from "../../service/apiAxios";
import { useEffect, useState } from "react";
import { PiPackage } from "react-icons/pi";
import TextArea from "antd/es/input/TextArea";
import SettingProfile from "../SettingProfile/SettingProfile";

import avatar from "./../../asset/images/avatar.jpg";

const Profile = () => {
  const [isIntroduce, setIsintroduce] = useState(false);
  const [TextIntroduce, setTextIntroduce] = useState("");

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const showLoading = () => {
    setOpen(true);
    setLoading(true);

    // Simple loading mock. You should add cleanup logic in real world.
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const Navigate = useNavigate();

  const params = useParams();

  const [profile, setProfile] = useState([]);

  const listProfileUser = async () => {
    try {
      let res = await getProfileUserAPI(params.id);
      if (res && res.data && res.data.EC === 0) {
        console.log(res.data.data.profile.introduce);
        setProfile(res.data.data);

        setTextIntroduce(res.data.data.profile.introduce || "");
      }
    } catch (error) {}
  };

  useEffect(() => {
    listProfileUser();
  }, [params.id]);

  const relationshipStatus = (value) => {
    switch (value) {
      case "Single":
        return "Độc thân";
      case "In a relationship":
        return "Đang hẹn hò";
      case "Engaged":
        return "Đã đính hôn";
      case "Married":
        return "Đã kết hôn";
      case "Complicated":
        return "Mối quan hệ phức tạp";
      case "Divorced":
        return "Đã ly hôn";
      case "Widowed":
        return "Góa";
      default:
        return "Không xác định";
    }
  };

  const onChange = (e) => {
    setTextIntroduce(e.target.value);
  };
  console.log(TextIntroduce);

  const handleOnChangeIntroduce = async () => {
    try {
      let res = await updateIntroduce(params.id, TextIntroduce);
      if (res && res.status === 200) {
        setProfile((prevProfile) => ({
          ...prevProfile,
          profile: { ...prevProfile.profile, introduce: TextIntroduce },
        }));
        setIsintroduce(false);
      } else {
        // Gọi lại API nếu cập nhật thất bại
        await listProfileUser();
      }
    } catch (error) {
      console.error("Error:", error);
      await listProfileUser(); // Rollback nếu cần
    }
  };

  console.log(profile);
  const banner = profile?.posts?.length
    ? profile.posts.filter((item) => item.checkImage === true)
    : [];

  return (
    <div className="w-full h-full absolute profile_user  m-auto">
      <div className=" absolute bottom-0 top-0 w-full  right-0  profile_user_main">
        <div className="profile_banner">
          <img
            className="rounded-md"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover", // Giữ tỷ lệ và cắt ảnh để vừa khung
              objectPosition: "center", // Canh giữa ảnh
            }}
            src={
              banner.length > 0 && banner[0].image?.length > 0
                ? banner[0].image[0]
                : avatar
            }
            alt="banner lỗi"
          />

          <div className="avatar_user flex items-center w-full gap-4 p-4 -mt-10 border-b-2">
            <div className="w-32 h-32 flex justify-center items-center">
              <img
                className="object-cover rounded-full w-full h-full"
                src={profile?.profile ? profile.profile.avatar : avatar}
                alt="avatar"
              />
            </div>
            <div className="flex items-center justify-between flex-1 ">
              <div className="flex flex-col  mt-6">
                <p className="text-lg font-semibold flex items-center gap-1">
                  {profile.profile && profile.profile.name}
                  <svg
                    viewBox="0 0 12 13"
                    width="16"
                    height="16"
                    fill="currentColor"
                    title="Tài khoản đã xác minh"
                    className="xfx01vb x1lliihq x1tzjh5l x1k90msu x2h7rmj x1qfuztq text-blue-700"
                  >
                    <title>Tài khoản đã xác minh</title>
                    <g fill-rule="evenodd" transform="translate(-98 -917)">
                      <path d="m106.853 922.354-3.5 3.5a.499.499 0 0 1-.706 0l-1.5-1.5a.5.5 0 1 1 .706-.708l1.147 1.147 3.147-3.147a.5.5 0 1 1 .706.708m3.078 2.295-.589-1.149.588-1.15a.633.633 0 0 0-.219-.82l-1.085-.7-.065-1.287a.627.627 0 0 0-.6-.603l-1.29-.066-.703-1.087a.636.636 0 0 0-.82-.217l-1.148.588-1.15-.588a.631.631 0 0 0-.82.22l-.701 1.085-1.289.065a.626.626 0 0 0-.6.6l-.066 1.29-1.088.702a.634.634 0 0 0-.216.82l.588 1.149-.588 1.15a.632.632 0 0 0 .219.819l1.085.701.065 1.286c.014.33.274.59.6.604l1.29.065.703 1.088c.177.27.53.362.82.216l1.148-.588 1.15.589a.629.629 0 0 0 .82-.22l.701-1.085 1.286-.064a.627.627 0 0 0 .604-.601l.065-1.29 1.088-.703a.633.633 0 0 0 .216-.819"></path>
                    </g>
                  </svg>
                </p>
                <span className="text-sm text-gray-600 ">
                  {profile.friends && profile.friends.length} bạn bè
                </span>
                <div className="flex items-center gap-0 ">
                  {profile?.friends &&
                    profile.friends.map((friend) => {
                      return (
                        <div>
                          <img
                            className="w-8 h-8 rounded-full object-cover "
                            src={friend.friendId.profile.avatar}
                            alt="friends"
                          />
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="float-right flex-1 m-auto flex justify-end items-center gap-3">
                <Button
                  type="primary"
                  className="font-bold"
                  onClick={() => Navigate("/stories/create")}
                >
                  Thêm vào tin
                </Button>
                <Button className="font-bold">Chỉnh sửa trang cá nhân</Button>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
      <div className="flex justify-between m-auto main_stack gap-2">
        <div className="main_left_stack ">
          <div className="flex friend_follows bg-[#ffffff]">
            <div className="p-4">
              <h1 className="font-bold text-2xl">Giới thiệu</h1>
              <p className="pt-3  text-center">
                {isIntroduce ? (
                  <TextArea
                    showCount
                    maxLength={100}
                    onChange={onChange}
                    placeholder=""
                    value={TextIntroduce}
                  />
                ) : (
                  profile.profile && profile.profile.introduce
                )}
              </p>
              {isIntroduce ? (
                <div className="flex justify-end gap-2 mt-2">
                  <Button
                    className="w-full mt-2 font-medium bg-slate-300"
                    onClick={() => setIsintroduce((prve) => !prve)}
                  >
                    Hủy
                  </Button>
                  <Button
                    className="w-full mt-2 font-medium bg-slate-300"
                    onClick={() => handleOnChangeIntroduce()}
                  >
                    Lưu
                  </Button>
                </div>
              ) : (
                <Button
                  className="w-full mt-2 font-medium bg-slate-300 mx-5"
                  onClick={() => setIsintroduce((prve) => !prve)}
                >
                  Chỉnh sửa tiểu sử
                </Button>
              )}
              {profile.profile &&
                profile.profile.education.length > 0 &&
                profile.profile.education.map((item, index) => {
                  return (
                    <div
                      className="icon_fitter mt-5 flex items-center gap-2"
                      key={index}
                    >
                      <img
                        className="cart_bag w-7 h-7"
                        src="https://static.xx.fbcdn.net/rsrc.php/v4/yp/r/Q9Qu4uLgzdm.png?_nc_eui2=AeEytIhTLqdxji6iPSrDFDvaCaefP1ANE1YJp58_UA0TVmQhryNmPUqQGCE_WyhIs-D6zj1VCHC8DCBX40eZqZqY"
                        alt="bag"
                      />
                      <span className="font-normal ">
                        Đã từng học{" "}
                        <span className="font-bold">{item.school}</span>
                      </span>
                    </div>
                  );
                })}
              <div className="icon_fitter mt-5 flex items-center gap-2">
                <img
                  className="cart_bag w-7 h-7"
                  src="https://static.xx.fbcdn.net/rsrc.php/v4/y5/r/VMZOiSIJIwn.png?_nc_eui2=AeEoMKG_Fjy8xkgVYerRu4BhFamB67gSZVMVqYHruBJlU7bXFsfHpycUgXqahdVTjY9itzSW448P7t6wmtwqcWHM"
                  alt="houres"
                />
                <span className="font-normal ">
                  Sống tại{" "}
                  <span className="font-bold">
                    {profile.profile && profile.profile.hometown}
                  </span>
                </span>
              </div>
              <div className="icon_fitter mt-5 flex items-center gap-2">
                <img
                  className="cart_bag w-7 h-7"
                  src="https://static.xx.fbcdn.net/rsrc.php/v4/yc/r/-e1Al38ZrZL.png?_nc_eui2=AeGy4DT_NTGesfAGDl4glz4PQkZ9FWERaDhCRn0VYRFoOCd9lhVEBIwaWpQNbiSdmksQ3-KyA3PAlJl5yOMhKCE3"
                  alt="houres"
                />
                <span className="font-normal ">
                  Đến từ{" "}
                  <span className="font-bold">
                    {profile.profile && profile.profile.currentCity}
                  </span>
                </span>
              </div>

              <div className="icon_fitter mt-5 flex items-center gap-2">
                <img
                  className="cart_bag w-7 h-7"
                  src="https://static.xx.fbcdn.net/rsrc.php/v4/yq/r/S0aTxIHuoYO.png?_nc_eui2=AeGab2rXk49ppiEviDYPZYFZeFJEy5Bw95R4UkTLkHD3lO75sJif9Hd-Q5m8WpN8yiJWTkU7x-ZAK149jqCsSxKP"
                  alt="houres"
                />
                <span className="font-normal ">
                  Tình trạng{" "}
                  <span className="font-bold">
                    {profile.profile &&
                      profile.profile.relationshipStatus &&
                      relationshipStatus(profile.profile.relationshipStatus)}
                  </span>
                </span>
              </div>
              <div className="icon_fitter mt-5 flex items-center gap-2">
                <img
                  className="cart_bag w-7 h-7"
                  src="https://static.xx.fbcdn.net/rsrc.php/v4/yJ/r/OyWm6cSjuMt.png?_nc_eui2=AeGIxOe96CX_xgpalD6hWMoweN3YDfA-neh43dgN8D6d6G1msFumX7uaWvmkxVhfrUMMxVAC0THTejFGzwakRmJL"
                  alt="houres"
                />
                <span className="font-normal ">
                  {" "}
                  Có <span className="font-bold">1.000.000 người theo dõi</span>
                </span>
              </div>
              <Button
                className="w-full mt-2 font-medium bg-slate-300 text-center mx-5"
                onClick={() => showLoading()}
              >
                Chỉnh sửa chi tiết
              </Button>
            </div>
          </div>

          {/* Ảnh  */}
          <div className="flex friend_follows bg-[#ffffff] mt-3">
            <div className="p-2 w-full">
              <div className="w-full flex items-center justify-between cursor-pointer ">
                <h1 className="font-bold text-xl">Ảnh</h1>
                <p className="font-bold ">Xem tất cả ảnh</p>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {profile &&
                  profile.posts &&
                  profile.posts.length > 0 &&
                  profile.posts.map((post) => {
                    if (post.checkImage === true) {
                      return (
                        post.image &&
                        post.image.length > 0 &&
                        post.image.map((item, index) => (
                          <img
                            key={index}
                            src={item}
                            className="w-40 h-32 rounded-md"
                            alt={`img-${index}`}
                          />
                        ))
                      );
                    }
                    return null; // Tránh lỗi nếu không có ảnh
                  })}
              </div>
            </div>
          </div>

          {/* bạn bè */}

          <div className="flex friend_follows bg-[#ffffff] mt-3">
            <div className="p-2 w-full">
              <div className="w-full flex items-center justify-between cursor-pointer ">
                <h1 className="font-bold text-xl">Bạn bè</h1>
                <p className="font-bold ">Xem tất cả bạn bè</p>
              </div>
              <div className="grid grid-cols-3 gap-1 ">
                {profile?.friends &&
                  profile.friends.map((friend) => {
                    return (
                      <div>
                        <img
                          src={friend.friendId.profile.avatar}
                          className="w-40 h-32 rounded-lg"
                          alt="img"
                        />
                        <span className="font-bold text-xs">
                          {friend.friendId.profile.avatar.name}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>

        <div className="flex right-0 " style={{ flex: 6 }}>
          <Main profile={profile} />
        </div>
        <SettingProfile
          open={open}
          setOpen={setOpen}
          loading={loading}
          profile={profile}
          listProfileUser={listProfileUser}
        />
      </div>
    </div>
  );
};

export default Profile;
