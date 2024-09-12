import React, { useState } from "react";
import { postRegisterUser } from "../../service/apiAxios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(null); // Initialize avatar as null
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Validate input fields before submission
  const validate = () => {
    let validationErrors = {};
    if (!email) validationErrors.email = "Email is required";
    if (!userName) validationErrors.userName = "Username is required";
    if (!password) validationErrors.password = "Password is required";
    if (!name) validationErrors.name = "Name is required";
    if (!avatar) validationErrors.avatar = "Avatar is required";
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };
  console.log(avatar);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0].name);
    }
  };
  // Register handler
  const handleRegister = async () => {
    if (!validate()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      let res = await postRegisterUser(email, userName, password, name, avatar);
      if (res && res.status === 200) {
        toast.success("Registration successful");
        setEmail("");
        setUserName("");
        setPassword("");
        setName("");
        setAvatar(null);
        setErrors({});
        navigate("/login"); // Redirect after successful registration
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <section className="h-full bg-neutral-200 dark:bg-neutral-700">
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

                    <p className="mb-4">Please register for a new account</p>

                    <input
                      type="text"
                      className="mb-4 w-full p-2 border rounded text-black"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && (
                      <p className="text-red-500">{errors.email}</p>
                    )}

                    <input
                      type="text"
                      className="mb-4 w-full p-2 border rounded text-black"
                      placeholder="Username"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                    {errors.userName && (
                      <p className="text-red-500">{errors.userName}</p>
                    )}

                    <input
                      type="password"
                      className="mb-4 w-full p-2 border rounded text-black"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && (
                      <p className="text-red-500">{errors.password}</p>
                    )}

                    <input
                      type="text"
                      className="mb-4 w-full p-2 border rounded text-black"
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    {errors.name && (
                      <p className="text-red-500">{errors.name}</p>
                    )}

                    <input
                      type="file"
                      className="mb-4 w-full p-2 border rounded text-black"
                      onChange={(e) => handleFileChange(e)}
                    />
                    {errors.avatar && (
                      <p className="text-red-500">{errors.avatar}</p>
                    )}

                    <div className="mb-12 pb-1 pt-1 text-center">
                      <button
                        className="mb-3 inline-block w-full rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white"
                        type="button"
                        style={{
                          background:
                            "linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)",
                        }}
                        onClick={handleRegister}
                      >
                        Register
                      </button>
                    </div>

                    <div className="flex items-center justify-between pb-6">
                      <p className="mb-0 mr-2">Already have an account?</p>
                      <button
                        type="button"
                        className="inline-block rounded border-2 px-6 pb-[6px] pt-2 text-xs font-medium"
                        onClick={() => navigate("/login")}
                      >
                        Login
                      </button>
                    </div>
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
                      We are more than just a company
                    </h4>
                    <p className="text-sm">
                      Duy Anh Media là một công ty truyền thông chuyên cung cấp
                      các dịch vụ sản xuất nội dung sáng tạo...
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

export default Register;
