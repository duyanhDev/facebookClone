import axios from "axios";
import { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8001/v1/api/forgot-password",
        { email: email }
      );
      console.log(response);

      alert(response.data.message);
    } catch (error) {
      alert(error.response.data.message);
    }
  };
  console.log(email);
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

                    <p className="mb-4">Vui lòng email để lấy lại mật khẩu</p>
                    {/* <!--Username input--> */}
                    <input
                      type="text"
                      className="mb-4 w-full p-2 border rounded text-black"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />

                    <div className="mb-12 pb-1 pt-1 text-center">
                      <button
                        onClick={() => handleForgotPassword()}
                        className="mb-3 inline-block w-full rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_rgba(0,0,0,0.2)] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)]"
                        type="button"
                        style={{
                          background:
                            "linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)",
                        }}
                      >
                        Lấy lại mật khẩu
                      </button>
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

export default ForgotPassword;
