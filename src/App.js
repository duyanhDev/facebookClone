import React, { useEffect, useState, useCallback } from "react";
import { matchPath, Outlet, useLocation } from "react-router-dom";
import Header from "./Components/Header/Header";
import SiderRight from "./Components/BannerRight/SiderRight";
import "./App.scss";
import SliderLeft from "./Components/Content/SiderLeft";
import {
  getAddUser,
  getSeenUser,
  getBestfriend,
  getCountNotifications,
  getNotificationsAPI,
  getUser,
} from "./service/apiAxios";
import io from "socket.io-client";

const socket = io("http://localhost:8001");

function App() {
  const location = useLocation();
  const username = localStorage.getItem("name");
  const currentUserId = localStorage.getItem("id");

  // State variables
  const [add, setAdd] = useState([]);
  const [status, setStatus] = useState("");
  const [idFriend, setIdFriend] = useState("");
  const [friend, setFriend] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [countNotifications, setcountNotifications] = useState(0);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [friendsToShow, setFriendsToShow] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [AllFriends, SetAllFriends] = useState([]);
  const [showLeftRight, setShowLeftRight] = useState(true); // State to control showing left and right sections

  // Socket.io event handlers
  useEffect(() => {
    const handlePendingFriends = (pendingFriends) => {
      setAdd(pendingFriends);
    };

    const handleFriendRequest = (data) => {
      alert(`Bạn có lời mời kết bạn từ ${data.senderName}`);
    };

    socket.on("update-pending-friends", handlePendingFriends);
    socket.on("new-friend-request", handleFriendRequest);

    return () => {
      socket.off("update-pending-friends", handlePendingFriends);
      socket.off("new-friend-request", handleFriendRequest);
    };
  }, []);

  // Fetch best friends
  const fetchBestFriend = useCallback(async () => {
    try {
      const res = await getBestfriend(currentUserId);
      if (res && res.data) {
        const data = res.data.map((item) => item.friendId);
        setFriend(data);
      }
    } catch (error) {
      console.error("Failed to fetch best friends:", error);
    }
  }, [currentUserId]);

  // Fetch all users
  const fetchAllUsers = useCallback(async () => {
    try {
      const res = await getUser();
      if (res && res.EC === 0) {
        SetAllFriends(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch all users:", error);
    }
  }, []);

  // Fetch add user data
  const fetchAddUserData = useCallback(async () => {
    try {
      const data = await getAddUser(currentUserId);
      if (data.data && data.status === 200) {
        const idResult = data.data.map((item) => item.friendId._id);
        setIdFriend(idResult[0] || "");
        setAdd(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch add user data:", error);
    }
  }, [currentUserId]);

  // Fetch seen user data
  const fetchSeenUserData = useCallback(async () => {
    try {
      const response = await getSeenUser(currentUserId);
      if (response && response.data && response.data.data) {
        const unreadCount = response.data.data;
        setStatus(unreadCount);
        return unreadCount;
      } else {
        setStatus(0);
        return 0;
      }
    } catch (error) {
      console.error("Failed to fetch seen user data:", error);
      setStatus(0);
      return 0;
    }
  }, [currentUserId]);

  // Fetch notification count
  const fetchCountNotification = useCallback(async () => {
    try {
      const res = await getCountNotifications(currentUserId);
      if (res && res.data.EC === 0) {
        setcountNotifications(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching notification count:", error);
    }
  }, [currentUserId]);

  // Fetch notifications
  const getNotifications = useCallback(async () => {
    try {
      const res = await getNotificationsAPI(currentUserId);
      if (res && res.data) {
        setData(res.data.notifications);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, [currentUserId]);

  // Initial data fetching
  useEffect(() => {
    fetchAddUserData();
    fetchBestFriend();
    fetchAllUsers();
  }, [fetchAddUserData, fetchBestFriend, fetchAllUsers]);

  // Set up polling intervals for real-time data
  useEffect(() => {
    // Initial calls
    fetchSeenUserData();
    fetchCountNotification();
    getNotifications();

    // Set up polling intervals
    const seenInterval = setInterval(fetchSeenUserData, 5000);
    const notificationCountInterval = setInterval(fetchCountNotification, 5000);
    const notificationsInterval = setInterval(getNotifications, 5000);

    // Clean up intervals on component unmount
    return () => {
      clearInterval(seenInterval);
      clearInterval(notificationCountInterval);
      clearInterval(notificationsInterval);
    };
  }, [fetchSeenUserData, fetchCountNotification, getNotifications]);

  // Dark mode toggle
  const handleToggleBtn = useCallback(() => {
    setIsDarkMode((prevMode) => !prevMode);
  }, []);

  // Apply dark mode class to body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");
    } else {
      document.body.classList.add("light-mode");
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  // Initialize friendsToShow
  useEffect(() => {
    setFriendsToShow(AllFriends.slice(0, 4));
  }, [AllFriends]);

  // Handle search functionality
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(
      () => {
        if (searchTerm.trim()) {
          const lowerCaseSearch = searchTerm.trim().toLowerCase();
          const filteredFriends = AllFriends.filter((item) =>
            item.profile.name.toLowerCase().includes(lowerCaseSearch)
          );
          setFriendsToShow(filteredFriends);
        } else {
          setFriendsToShow(AllFriends.slice(0, 4));
        }
        setLoading(false);
      },
      searchTerm.trim() ? 1000 : 0
    );

    return () => clearTimeout(timer);
  }, [searchTerm, AllFriends]);

  // Determine if the user is on profile or friends page
  const isProfilePage = matchPath("/profile/:id", location.pathname);
  const isFriendsPage = matchPath("/friends", location.pathname);
  const isFriendsRequest = matchPath("/friends/requests", location.pathname);
  // Update showLeftRight state based on current page
  useEffect(() => {
    if (isProfilePage || isFriendsPage || isFriendsRequest) {
      setShowLeftRight(false); // Hide left and right sections
    } else {
      setShowLeftRight(true); // Show left and right sections
    }
  }, [isProfilePage, isFriendsPage || isFriendsRequest]);

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
          HandleTogleBtn={handleToggleBtn}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          fetchSeenUserData={fetchSeenUserData}
          countNotifications={countNotifications}
          dataNocatifion={data}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          friends={friendsToShow}
          isLoading={isLoading}
        />
      </div>

      <div className="content flex justify-between">
        {showLeftRight && (
          <div className="left">
            <SliderLeft
              username={username}
              isDarkMode={isDarkMode}
              friend={friend}
              currentUserId={currentUserId}
              isProfilePage={isProfilePage}
              isPhotoPage={false} // Assuming `isPhotoPage` is false here
            />
          </div>
        )}

        <div className="main w-auto m-auto flex justify-center items-center min-h-screen">
          <Outlet
            context={{ isDarkMode, fetchCountNotification, getNotifications }}
          />
        </div>

        {showLeftRight && (
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
        )}
      </div>
    </div>
  );
}

export default App;
