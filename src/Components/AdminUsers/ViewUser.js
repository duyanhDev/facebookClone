import React, { useState, useEffect } from "react";
import { Modal, Input, Select, DatePicker, Button, Upload, List } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { getProfileUserAPI } from "../../service/apiAxios";
import moment from "moment";

const { Option } = Select;

const ViewUsers = ({ id, modal2Open, setModal2Open }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  // State cho từng trường
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState(null);
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [currentCity, setCurrentCity] = useState("");
  const [hometown, setHometown] = useState("");
  const [relationshipStatus, setRelationshipStatus] = useState("");
  const [languages, setLanguages] = useState([]);
  const [websites, setWebsites] = useState([]);

  // Lấy dữ liệu người dùng từ API
  const fetchDataUsers = async () => {
    try {
      setLoading(true);
      let res = await getProfileUserAPI(id);
      if (res && res.data && res.data.EC === 0) {
        const data = res.data.data;
        setUserData(data);
        setEmail(data.email || "");
        setUsername(data.username || "");
        setName(data.profile?.name || "");
        setGender(data.profile?.gender || "");
        setBirthday(
          data.profile?.birthday ? moment(data.profile.birthday) : null
        );
        setBio(data.profile?.bio || "");
        setAvatar(data.profile?.avatar || "");
        setCurrentCity(data.profile?.currentCity || "");
        setHometown(data.profile?.hometown || "");
        setRelationshipStatus(data.profile?.relationshipStatus || "");
        setLanguages(data.profile?.languages || []);
        setWebsites(data.profile?.websites || []);
      }
    } catch (error) {
      console.log("Lỗi khi lấy dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (modal2Open && id) {
      fetchDataUsers();
    }
  }, [id, modal2Open]);

  // Xử lý submit dữ liệu
  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedData = {
        email,
        username,
        profile: {
          name,
          gender,
          birthday: birthday ? birthday.toISOString() : null,
          bio,
          avatar,
          currentCity,
          hometown,
          relationshipStatus,
          languages,
          websites,
        },
      };
      await fetch(`http://your-backend-url/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      setModal2Open(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý upload ảnh
  const handleUpload = ({ fileList }) => {
    const avatarUrl = "http://your-backend-url/uploads/avatar.jpg"; // Thay bằng logic upload thực tế
    setAvatar(avatarUrl);
  };

  // Style chung
  const inputStyle = {
    borderRadius: "8px",
    padding: "8px",
    border: "1px solid #d9d9d9",
    width: "100%",
  };

  const labelStyle = {
    fontWeight: "600",
    marginBottom: "8px",
    color: "#333",
  };

  const sectionStyle = {
    marginBottom: "24px",
  };

  return (
    <div>
      <Modal
        title={
          <span
            style={{ fontSize: "20px", fontWeight: "bold", color: "#1d39c4" }}
          >
            Xem thông tin người dùng
          </span>
        }
        centered
        open={modal2Open}
        onOk={handleSave}
        onCancel={() => setModal2Open(false)}
        okText="Lưu"
        cancelText="Hủy"
        confirmLoading={loading}
        width={900}
        style={{ borderRadius: "12px", overflow: "hidden" }}
        bodyStyle={{ padding: "24px", background: "#f9f9f9" }}
        okButtonProps={{
          style: { background: "#1d39c4", borderRadius: "8px" },
        }}
        cancelButtonProps={{ style: { borderRadius: "8px" } }}
      >
        {userData ? (
          <div
            style={{ maxHeight: "70vh", overflowY: "auto", padding: "0 16px" }}
          >
            {/* Thông tin cơ bản */}
            <div
              style={{
                ...sectionStyle,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "24px",
              }}
            >
              <div>
                <label style={labelStyle}>Email</label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email"
                  style={inputStyle}
                  disabled
                />
              </div>
              <div>
                <label style={labelStyle}>Tên người dùng</label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nhập tên người dùng"
                  style={inputStyle}
                  disabled
                />
              </div>
            </div>

            <div style={sectionStyle}>
              <label style={labelStyle}>Tên hiển thị</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên hiển thị"
                style={inputStyle}
                disabled
              />
            </div>

            <div
              style={{
                ...sectionStyle,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "24px",
              }}
            >
              <div>
                <label style={labelStyle}>Giới tính</label>
                <Select
                  value={gender}
                  onChange={(value) => setGender(value)}
                  placeholder="Chọn giới tính"
                  style={{ ...inputStyle, padding: "0" }}
                  disabled
                >
                  <Option value="male">Nam</Option>
                  <Option value="female">Nữ</Option>
                  <Option value="other">Khác</Option>
                </Select>
              </div>
              <div>
                <label style={labelStyle}>Ngày sinh</label>
                <DatePicker
                  value={birthday}
                  onChange={(date) => setBirthday(date)}
                  format="DD/MM/YYYY"
                  style={{ ...inputStyle, padding: "4px 11px" }}
                  disabled
                />
              </div>
            </div>

            <div style={sectionStyle}>
              <label style={labelStyle}>Tiểu sử</label>
              <Input.TextArea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Nhập tiểu sử"
                style={{ ...inputStyle, resize: "none" }}
                disabled
              />
            </div>

            {/* Ảnh đại diện */}
            <div style={sectionStyle}>
              <label style={labelStyle}>Ảnh đại diện</label>
              <div
                style={{ display: "flex", alignItems: "center", gap: "16px" }}
              >
                {avatar && (
                  <img
                    src={avatar}
                    alt="Avatar"
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid #d9d9d9",
                      transition: "transform 0.3s",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.transform = "scale(1.05)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.transform = "scale(1)")
                    }
                  />
                )}
                <Upload
                  listType="picture"
                  maxCount={1}
                  beforeUpload={() => false}
                  onChange={handleUpload}
                >
                  <Button
                    icon={<UploadOutlined />}
                    style={{ borderRadius: "8px", background: "#f0f0f0" }}
                    disabled
                  >
                    Tải lên ảnh
                  </Button>
                </Upload>
              </div>
            </div>

            {/* Địa chỉ */}
            <div
              style={{
                ...sectionStyle,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "24px",
              }}
            >
              <div>
                <label style={labelStyle}>Nơi ở hiện tại</label>
                <Input
                  value={currentCity}
                  onChange={(e) => setCurrentCity(e.target.value)}
                  placeholder="Nhập nơi ở hiện tại"
                  style={inputStyle}
                  disabled
                />
              </div>
              <div>
                <label style={labelStyle}>Quê quán</label>
                <Input
                  value={hometown}
                  onChange={(e) => setHometown(e.target.value)}
                  placeholder="Nhập quê quán"
                  disabled
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Thông tin khác */}
            <div style={sectionStyle}>
              <label style={labelStyle}>Tình trạng quan hệ</label>
              <Select
                value={relationshipStatus}
                onChange={(value) => setRelationshipStatus(value)}
                placeholder="Chọn tình trạng"
                style={{ ...inputStyle, padding: "0" }}
                disabled
              >
                <Option value="Single">Độc thân</Option>
                <Option value="In a relationship">Đang hẹn hò</Option>
                <Option value="Engaged">Đã đính hôn</Option>
                <Option value="Married">Đã kết hôn</Option>
                <Option value="Complicated">Phức tạp</Option>
                <Option value="Divorced">Đã ly hôn</Option>
                <Option value="Widowed">Góa</Option>
              </Select>
            </div>

            <div style={sectionStyle}>
              <label style={labelStyle}>Ngôn ngữ</label>
              <Select
                mode="tags"
                value={languages}
                onChange={(value) => setLanguages(value)}
                placeholder="Nhập các ngôn ngữ"
                style={{ ...inputStyle, padding: "0" }}
              >
                <Option value="Vietnamese">Tiếng Việt</Option>
                <Option value="English">Tiếng Anh</Option>
                <Option value="French">Tiếng Pháp</Option>
              </Select>
            </div>

            <div style={sectionStyle}>
              <label style={labelStyle}>Website</label>
              <Select
                mode="tags"
                value={websites}
                onChange={(value) => setWebsites(value)}
                placeholder="Nhập các website"
                style={{ ...inputStyle, padding: "0" }}
              />
            </div>

            {/* Danh sách */}
            <div style={sectionStyle}>
              <label style={labelStyle}>Học vấn</label>
              <List
                dataSource={userData.profile?.education || []}
                renderItem={(edu) => (
                  <List.Item
                    style={{
                      background: "#fff",
                      borderRadius: "8px",
                      marginBottom: "8px",
                    }}
                  >
                    <span style={{ color: "#555" }}>
                      {edu.school} - {edu.degree}
                    </span>
                  </List.Item>
                )}
                style={{
                  background: "#f0f0f0",
                  padding: "8px",
                  borderRadius: "8px",
                }}
              />
            </div>

            <div style={sectionStyle}>
              <label style={labelStyle}>Công việc</label>
              <List
                dataSource={userData.profile?.work || []}
                renderItem={(work) => (
                  <List.Item
                    style={{
                      background: "#fff",
                      borderRadius: "8px",
                      marginBottom: "8px",
                    }}
                  >
                    <span style={{ color: "#555" }}>
                      {work.company} - {work.position}
                    </span>
                  </List.Item>
                )}
                style={{
                  background: "#f0f0f0",
                  padding: "8px",
                  borderRadius: "8px",
                }}
              />
            </div>
          </div>
        ) : (
          <p style={{ textAlign: "center", color: "#888" }}>
            Đang tải dữ liệu...
          </p>
        )}
      </Modal>
    </div>
  );
};

export default ViewUsers;
