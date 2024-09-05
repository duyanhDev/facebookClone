import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Components/Header/Header";
import SiderRight from "./Components/BannerRight/SiderRight";
import "./App.scss";
import SliderLeft from "./Components/Content/SiderLeft";
import { useEffect, useState } from "react";
import { getAddUser } from "./service/apiAxios";
function App() {
  const [add, setAdd] = useState("");

  const FeachAPI = async () => {
    let data = await getAddUser("66d5cbd21c9b67c69cdd9c13");
    if (data.data && data.status === 200) {
      let result = data.data.map((item) => item.friendId.username);
      setAdd(result);
    }
  };
  console.log(add);

  useEffect(() => {
    FeachAPI();
  }, []);
  return (
    <div className="App">
      <div className="Header-content flex justify-between">
        <Header />
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
