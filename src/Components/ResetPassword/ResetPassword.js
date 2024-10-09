import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams(); // Get the token from URL params
  const [newPassword, setNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    console.log("Token from URL:", token); // Log token for debugging
  }, [token]);

  const handleResetPassword = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8001/v1/api/reset-password/${token}`,
        { newPassword }
      );
      alert(response.data.message); // Show success message
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Có lỗi xảy ra"); // Handle error
    }
  };

  return (
    <section
      className="h-full bg-neutral-200 dark:bg-neutral-700 w-full"
      style={{ height: "100vh" }}
    >
      <div className="container h-full p-10">
        <div className="g-6 flex h-full flex-wrap items-center justify-center text-neutral-800 dark:text-neutral-200">
          <div className="w-full">
            <div className="block rounded-lg bg-white shadow-lg dark:bg-neutral-800">
              <div className="g-0 lg:flex lg:flex-wrap">
                <div className="px-4 md:px-0 lg:w-6/12">
                  <div className="md:mx-6 md:p-12">
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
                    <h2>Đặt lại mật khẩu</h2>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Nhập mật khẩu mới"
                    />
                    <button onClick={handleResetPassword}>
                      Đặt lại mật khẩu
                    </button>
                    {errorMessage && (
                      <p style={{ color: "red" }}>{errorMessage}</p>
                    )}{" "}
                    {/* Show error message if exists */}
                  </div>
                </div>
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
                      Duy Anh Media là một công ty truyền thông chuyên cung cấp
                      các dịch vụ sản xuất nội dung sáng tạo, từ quay phim, chụp
                      ảnh đến quản lý chiến lược truyền thông số, giúp khách
                      hàng xây dựng thương hiệu và tiếp cận hiệu quả đối tượng
                      mục tiêu.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
