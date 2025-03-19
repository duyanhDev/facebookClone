import { Avatar, Menu, Switch } from "antd";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import "./Admin.scss";
import { Outlet } from "react-router-dom";

const items = [
  {
    key: "sub1",
    label: "Navigation One",
    icon: <MailOutlined />,
    children: [
      {
        key: "1",
        label: "Tài Khoản người dùng",
      },
      {
        key: "2",
        label: "Tài Khoản Admin",
      },
      {
        key: "3",
        label: "Option 3",
      },
      {
        key: "4",
        label: "Option 4",
      },
    ],
  },
  {
    key: "sub2",
    label: "Navigation Two",
    icon: <AppstoreOutlined />,
    children: [
      {
        key: "5",
        label: "Option 5",
      },
      {
        key: "6",
        label: "Option 6",
      },
      {
        key: "sub3",
        label: "Submenu",
        children: [
          {
            key: "7",
            label: "Option 7",
          },
          {
            key: "8",
            label: "Option 8",
          },
        ],
      },
    ],
  },
  {
    key: "sub4",
    label: "Navigation Three",
    icon: <SettingOutlined />,
    children: [
      {
        key: "9",
        label: "Option 9",
      },
      {
        key: "10",
        label: "Option 10",
      },
      {
        key: "11",
        label: "Option 11",
      },
      {
        key: "12",
        label: "Option 12",
      },
    ],
  },
];
const Admin = () => {
  const [theme, setTheme] = useState("dark");
  const [current, setCurrent] = useState("1");

  const changeTheme = (value) => {
    setTheme(value ? "dark" : "light");
  };

  const onClick = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };

  return (
    <div className="container_admin flex">
      <div className="main_letf w-1/6 min-h-screen">
        <Switch
          checked={theme === "dark"}
          onChange={changeTheme}
          checkedChildren="Dark"
          unCheckedChildren="Light"
        />
        <br />
        <br />
        <Menu
          theme={theme}
          onClick={onClick}
          style={{ width: "100%" }}
          defaultOpenKeys={["sub1"]}
          selectedKeys={[current]}
          mode="inline"
          items={items}
        />
      </div>
      <div className="main_right w-5/6 absolute right-0 min-h-screen">
        {/* Thêm nội dung cho phần bên phải nếu cần */}
        <div className="header_right h-16 w-full border-b-2 m-auto">
          <div className="h-full">
            <ul className=" flex items-center justify-between h-full mx-4">
              <li>
                <MenuOutlined className="text-4xl" />
              </li>
              <li>
                <Avatar
                  style={{
                    backgroundColor: "#fde3cf",
                    color: "#f56a00",
                  }}
                  className="w-14 h-14"
                >
                  U
                </Avatar>
              </li>
            </ul>
          </div>
        </div>

        <div className="content_main h-full">
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
};

export default Admin;
