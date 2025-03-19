import { Button, Input, Modal, Table } from "antd";
import { createStyles } from "antd-style";
import { useEffect, useState } from "react";
import { getUser } from "../../service/apiAxios";
import { render } from "nprogress";
import ViewUsers from "./ViewUser";
import UpdateUsers from "./UpdateUser";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
const useStyle = createStyles(({ css, token }) => {
  const { antCls } = token;
  return {
    customTable: css`
      ${antCls}-table {
        ${antCls}-table-container {
          ${antCls}-table-body,
          ${antCls}-table-content {
            scrollbar-width: thin;
            scrollbar-color: #eaeaea transparent;
            scrollbar-gutter: stable;
          }
        }
      }
    `,
  };
});

const AdminUsers = () => {
  const { styles } = useStyle();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Dữ liệu sau khi lọc
  const [searchText, setSearchText] = useState(""); // Từ khóa tìm kiếm
  const [modal2Open, setModal2Open] = useState(false);
  const [modal3Open, setModal3Open] = useState(false);
  const [modalCreate, setModalCreate] = useState(false);
  const [idUser, setIdUsers] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(false);
  const dataUsers = async () => {
    try {
      let res = await getUser();

      if (res && res.EC === 0) {
        setData(res.data);
        setFilteredData(res.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    dataUsers();
  }, []);

  useEffect(() => {
    const filtered = data.filter((item) =>
      item.profile?.name?.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchText, data]);
  const columns = [
    {
      title: "STT",
      width: 100,
      dataIndex: "STT",
      key: "index",
      fixed: "left",
    },
    {
      title: "Email",
      width: 100,
      dataIndex: "email",
      key: "email",
      fixed: "left",
    },
    {
      title: "Tài khoản",
      width: 100,
      dataIndex: "username",
      key: "username",
      fixed: "left",
    },
    {
      title: "Tên hiển thị",
      dataIndex: "name",
      key: "name",
      width: 150,
    },
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      width: 150,
      render: (avatar) => (
        <img
          src={avatar || "https://via.placeholder.com/50"} // Hình mặc định nếu không có avatar
          alt="Avatar"
          style={{ width: 50, height: 50, objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Giới thiệu",
      dataIndex: "introduce",
      key: "introduce",
      width: 150,
    },
    {
      title: "Education",
      dataIndex: "education",
      key: "education",
      width: 150,
      render: (education) =>
        education && education.length > 0
          ? education.map((edu) => edu.school).join(", ")
          : "Chưa cập nhật",
    },
    {
      title: "Languages",
      dataIndex: "languages",
      key: "languages",
      width: 150,
      render: (languages) =>
        languages && languages.length > 0
          ? languages.join(", ")
          : "Chưa cập nhật",
    },
    {
      title: "Mối quan hệ",
      dataIndex: "relationshipStatus",
      key: "relationshipStatus",
      width: 150,
      render: (status) => status || "Chưa cập nhật",
    },
    {
      title: "Websites",
      dataIndex: "websites",
      key: "websites",
      width: 150,
      render: (websites) =>
        websites && websites.length > 0 ? websites.join(", ") : "Chưa cập nhật",
    },
    {
      title: "Privacy Settings",
      dataIndex: "privacySettings",
      key: "privacySettings",
      width: 150,
      render: (settings) => settings?.profileVisibility || "Chưa cập nhật",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      width: 150,
    },
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      width: 150,
      render: (item) => (
        <div className="flex items-center gap-2">
          <Button
            type="primary"
            onClick={() => {
              setModal2Open(true);
              setIdUsers(item.key);
            }}
          >
            Xem
          </Button>
          <Button
            onClick={() => {
              setModal3Open(true);
              setIdUsers(item.key);
            }}
          >
            Sửa
          </Button>
          <Button danger>Xóa</Button>
        </div>
      ),
    },
  ];
  const dataSource =
    filteredData &&
    filteredData.length > 0 &&
    filteredData
      // Lọc chỉ lấy user có role là "users"
      .map((item, i) => ({
        key: item._id || i, // Dùng _id từ backend nếu có, không thì dùng index
        STT: i + 1, // Số thứ tự bắt đầu từ 1
        email: item.email,
        username: item.username,
        name: item.profile?.name || "Chưa cập nhật",
        avatar: item.profile?.avatar,
        introduce: item.profile?.introduce,
        education: item.profile?.education,
        languages: item.profile?.languages,
        relationshipStatus: item.profile?.relationshipStatus,
        websites: item.profile?.websites,
        privacySettings: item.privacySettings,
        role: item.role,
      }));

  const onChangePassword = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);

    // Kiểm tra ngay khi cập nhật giá trị
    if (password && value !== password) {
      setError(true);
    } else {
      setError(false);
    }
  };

  return (
    <div className="h-full">
      {/* Thanh tìm kiếm */}
      <div className="flex justify-between items-center mx-11 my-5">
        <Input
          placeholder="Tìm kiếm theo tên..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-48"
        />
        <Button className="w-40" onClick={() => setModalCreate(true)}>
          Thêm tài khoản
        </Button>
      </div>
      <Table
        className={styles.customTable}
        columns={columns}
        dataSource={dataSource}
        scroll={{
          x: "max-content",
          y: 105 * 5,
        }}
      />

      <ViewUsers
        modal2Open={modal2Open}
        setModal2Open={setModal2Open}
        id={idUser}
      />
      <UpdateUsers
        modal3Open={modal3Open}
        setModal3Open={setModal3Open}
        id={idUser}
      />

      <Modal
        title="Đăng kí tài khoản"
        centered
        open={modalCreate}
        onOk={() => setModalCreate(false)}
        onCancel={() => setModalCreate(false)}
      >
        <div>
          <label htmlFor="email">Email</label>
          <Input type="email" placeholder="nhập email" id="email" />
        </div>

        <div>
          <label htmlFor="username">Tài khoản</label>
          <Input type="text" placeholder="nhập tài khoản" id="username" />
        </div>
        <div>
          <label htmlFor="name">nick name</label>
          <Input type="text" placeholder="nhập tài khoản" id="name" />
        </div>
        <div>
          <label htmlFor="password">Mật khẩu</label>
          <Input.Password
            placeholder="Nhập mật khẩu"
            id="password"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="confirmpassword">Nhập lại mật khẩu</label>
          <Input.Password
            placeholder="Nhập lại mật khẩu"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
            onChange={(e) => onChangePassword(e)}
          />
          {error && <span style={{ color: "red" }}>Mật khẩu không khớp!</span>}
        </div>
      </Modal>
    </div>
  );
};

export default AdminUsers;
