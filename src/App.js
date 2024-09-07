import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Components/Header/Header";
import SiderRight from "./Components/BannerRight/SiderRight";
import "./App.scss";
import SliderLeft from "./Components/Content/SiderLeft";
import { useEffect, useState } from "react";
import { getAddUser, getSeenUser } from "./service/apiAxios";
function App() {
  const [add, setAdd] = useState("");
  const [status, setStatus] = useState("");
  const FeachAPI = async () => {
    let data = await getAddUser("66dc0fb26c16f18c8eee0e0b");
    console.log(data);

    if (data.data && data.status === 200) {
      let result = data.data.map((item) => item.friendId.username);
      setAdd(result);
    }
  };

  console.log(add);

  const FeachSeenAPI = async () => {
    let data = await getSeenUser("66dc0fb26c16f18c8eee0e0b");
    if (data && data.data && data.data.data) {
      console.log(data.data.data);

      setStatus(data.data.data);
    }
  };

  useEffect(() => {
    FeachAPI();
    FeachSeenAPI();
  }, []);

  return (
    <div className="App">
      <div className="Header-content flex justify-between ">
        <Header status={status} />
      </div>

      <div className="content flex justify-between">
        <div className="left  ">
          <SliderLeft />
        </div>
        <div className="main w-auto m-auto flex justify-center items-center min-h-screen ">
          <Outlet />
        </div>
        <div className="right mt-4">
          <SiderRight add={add} />
        </div>
      </div>
    </div>
  );
}

export default App;
