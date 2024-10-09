import React, { useEffect, useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Components/Header/Header";
import SiderRight from "./Components/BannerRight/SiderRight";
import "./App.scss";
import SliderLeft from "./Components/Content/SiderLeft";
import { getAddUser, getSeenUser, getBestfriend } from "./service/apiAxios";

function App() {
  const username = localStorage.getItem("name");
  const [add, setAdd] = useState([]);
  const [status, setStatus] = useState("");
  const [idFriend, setIdFriend] = useState("");
  const [friend, setFriend] = useState("");
  const currentUserId = localStorage.getItem("id");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Memoize hàm feachBestFriend
  const feachBestFriend = useCallback(async () => {
    let res = await getBestfriend(currentUserId);
    if (res && res.data) {
      let data = res.data.map((item) => {
        return item.friendId;
      });
      setFriend(data);
    }
  }, [currentUserId]);
  const fetchAddUserData = async () => {
    try {
      const data = await getAddUser(currentUserId);
      console.log(data);

      if (data.data && data.status === 200) {
        const result = data.data.map((item) => item.friendId.profile.name);
        console.log(data.data);

        const idResult = data.data.map((item) => item.friendId._id);

        setIdFriend(idResult[0]);

        setAdd(result);
      }
    } catch (error) {
      console.error("Failed to fetch add user data:", error);
      // Optionally, you can use toast notifications to show errors
    }
  };
  useEffect(() => {
    fetchAddUserData();
  }, [currentUserId]);

  const fetchSeenUserData = async () => {
    try {
      const response = await getSeenUser(currentUserId);
      if (response && response.data && response.data.data) {
        const unreadCount = response.data.data;
        setStatus(unreadCount);
        return unreadCount; //
      } else {
        setStatus(0);
        return 0;
      }
    } catch (error) {
      setStatus(0);
      return 0;
    }
  };
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchSeenUserData();
    }, 2000); // Thay đổi thời gian (5000ms = 5 giây) tùy thuộc vào nhu cầu của bạn

    return () => clearInterval(intervalId); // Dọn dẹp interval khi component unmount
  }, [currentUserId]); // Đảm bảo rằng useEffect được gọi lại khi currentUserId thay đổi

  // Gọi feachBestFriend trong useEffect và thêm feachBestFriend vào mảng phụ thuộc
  useEffect(() => {
    feachBestFriend();
  }, [feachBestFriend]);

  const HandleTogleBtn = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");
    } else {
      document.body.classList.add("light-mode");
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);
  return (
    <div className="App">
      <div
        className={`Header-content flex justify-between ${
          isDarkMode ? "dark-mode" : "light-mode"
        }`}
      >
        <Header
          status={status}
          username={username}
          HandleTogleBtn={HandleTogleBtn}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          fetchSeenUserData={fetchSeenUserData}
        />
      </div>

      <div className="content flex justify-between">
        <div className="left">
          <SliderLeft username={username} isDarkMode={isDarkMode} />
        </div>
        <div className="main w-auto m-auto flex justify-center items-center min-h-screen">
          <Outlet context={{ isDarkMode }} />
        </div>
        <div className="right mt-4">
          <SiderRight
            add={add}
            friend={friend}
            fetchSeenUserData={fetchSeenUserData}
            status={status}
            idFriend={idFriend}
            fetchAddUserData={fetchAddUserData}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
