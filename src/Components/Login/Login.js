import React, { useState, useContext } from "react";
import { postLoginUser } from "../../service/apiAxios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext ";
import BeatLoader from "react-spinners/BeatLoader";

import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import "./Login.scss";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [showEye, setShowEye] = useState(false);
  const navigate = useNavigate();
  // Handle login
  const { setIsAuthenticated } = useContext(AuthContext);
  const { setRole } = useContext(AuthContext);
  const handleLogin = async () => {
    setLoading(true);
    try {
      // Kiểm tra định dạng email
      let InVaild =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!InVaild.test(email)) {
        toast.error("Vui lòng nhập đúng email");
        setLoading(false);
        return;
      }

      // Gọi API đăng nhập
      let res = await postLoginUser(email, password);
      console.log("API response:", res);

      if (res && res.EC === 0) {
        const { name, id, avatar, role } = res.data;
        const { token, refreshToken } = res;

        // Lưu vào localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("name", name);
        localStorage.setItem("avatar", avatar);
        localStorage.setItem("id", id);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("role", role);

        // Cập nhật trạng thái xác thực và vai trò
        setIsAuthenticated(true);
        setRole(role);

        toast.success("Đăng nhập thành công");

        // Điều hướng dựa trên vai trò
        if (role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        toast.error(res.error || "Đăng nhập thất bại");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      toast.error("Đã xảy ra lỗi, vui lòng thử lại");
    } finally {
      setLoading(false); // Dừng loader dù thành công hay thất bại
    }
  };

  const HandleShowEye = () => {
    setShowEye(!showEye);
  };
  const handleResgin = () => {
    navigate("/register");
  };
  return (
    <>
      {isLoading && (
        <>
          <div className="background-overlay"></div> {/* Nền mờ */}
          <div className="icon-login">
            <BeatLoader color="#ffffff" />
          </div>
        </>
      )}

      <section className="h-full bg-neutral-200 dark:bg-neutral-700">
        <div className="container h-full p-10">
          <div className="g-6 flex h-full flex-wrap items-center justify-center text-neutral-800 dark:text-neutral-200">
            <div className="w-full">
              <div className="block rounded-lg bg-white shadow-lg dark:bg-neutral-800">
                <div className="g-0 lg:flex lg:flex-wrap">
                  {/* <!-- Left column container--> */}
                  <div className="px-4 md:px-0 lg:w-6/12">
                    <div className="md:mx-6 md:p-12">
                      {/* <!--Logo--> */}
                      <div className="text-center">
                        <img
                          className="mx-auto w-48"
                          src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
                          alt="logo"
                        />
                        <h4 className="mb-12 mt-1 pb-1 text-xl font-semibold">
                          Duy Anh Media
                        </h4>
                      </div>

                      <p className="mb-4">
                        Vui lòng đăng nhập vào tài khoản của bạn
                      </p>
                      {/* <!--Username input--> */}
                      <input
                        type="text"
                        className="mb-4 w-full p-2 border rounded text-black"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />

                      {/* <!--Password input--> */}
                      <div className="relative flex items-center w-full">
                        <input
                          type={showEye ? "text" : "password"}
                          className="mb-4 w-full p-2 border rounded text-black"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        {showEye ? (
                          <EyeOutlined
                            className="icon-eye"
                            onClick={HandleShowEye}
                          />
                        ) : (
                          <EyeInvisibleOutlined
                            className="icon-eye"
                            onClick={HandleShowEye}
                          />
                        )}
                      </div>

                      {/* <!--Submit button--> */}
                      <div className="mb-12 pb-1 pt-1 text-center">
                        <button
                          onClick={() => handleLogin()}
                          className="mb-3 inline-block w-full rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_rgba(0,0,0,0.2)] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)]"
                          type="button"
                          style={{
                            background:
                              "linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)",
                          }}
                        >
                          Log in
                        </button>

                        {/* <!--Forgot password link--> */}
                        <a href="#!">Quên mật khẩu?</a>
                      </div>

                      {/* <!--Register button--> */}
                      <div className="flex items-center justify-between pb-6">
                        <p className="mb-0 mr-2">Bạn chưa có tài khoản?</p>
                        <div className="">
                          <button
                            type="button"
                            className="inline-block rounded border-2 border-danger px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-danger transition duration-150 ease-in-out hover:border-danger-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-danger-600 focus:border-danger-600 focus:text-danger-600 focus:outline-none focus:ring-0 active:border-danger-700 active:text-danger-700 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10"
                            onClick={handleResgin}
                          >
                            Đăng ký
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <!-- Right column container with background and description--> */}
                  <div
                    className="flex items-center rounded-b-lg lg:w-6/12 lg:rounded-r-lg lg:rounded-bl-none"
                    style={{
                      background:
                        "linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)",
                    }}
                  >
                    <div className="px-4 py-6 text-white md:mx-6 md:p-12">
                      <h4 className="mb-6 text-xl font-semibold">
                        DuyAnhMedia không chỉ là một công ty truyền thông
                      </h4>
                      <p className="text-sm">
                        Duy Anh Media là một công ty truyền thông chuyên cung
                        cấp các dịch vụ sản xuất nội dung sáng tạo, từ quay
                        phim, chụp ảnh đến quản lý chiến lược truyền thông số,
                        giúp khách hàng xây dựng thương hiệu và tiếp cận hiệu
                        quả đối tượng mục tiêu.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
