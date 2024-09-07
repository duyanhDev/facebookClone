import { Routes, Route } from "react-router-dom";
import App from "./App";
import SliderLeft from "./Components/Content/SiderLeft";
import Main from "./../src/Components/Main/Main.js";
import Login from "./Components/Login/Login";
const Layout = () => {
  return (
    <Routes>
      <Route path="/" element={<App />}>
        {/* <Route index element={<Header />} /> */}
        <Route index element={<Main />} />
        <Route path="/watch" element={<SliderLeft />} />
      </Route>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default Layout;
