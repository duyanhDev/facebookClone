import React, { useState, useEffect } from "react";
import {
  Modal,
  Input,
  Select,
  DatePicker,
  Button,
  Upload,
  List,
  notification,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  APIUpdateWorkByConditions,
  getProfileUserAPI,
  HanldeAPICreateEductionkUser,
  HanldeAPICreateWorkUser,
  HanldeAPIDeleteEducation,
  HanldeAPIDeleteWord,
  putProfileIntroduce,
} from "../../service/apiAxios";
import moment from "moment";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";

const { Option } = Select;

const UpdateUsers = ({ id, modal3Open, setModal3Open }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [modalpen, setModalopen] = useState(false);
  const [modalpenSetting, setModalOpenSetting] = useState(false);
  const [modalpenShool, setModalopenSchool] = useState(false);
  // State cho từng trường
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState(null);
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState(null); // Chỉ lưu file hoặc URL
  const [currentCity, setCurrentCity] = useState("");
  const [hometown, setHometown] = useState("");
  const [relationshipStatus, setRelationshipStatus] = useState("");
  const [languages, setLanguages] = useState([]);
  const [websites, setWebsites] = useState([]);
  const [introduce, setIntroduce] = useState("");
  const password = "";
  const role = "user";

  const [newEducation, setNewEducation] = useState("");
  const [newWork, setNewWork] = useState("");

  const [startDate, setStartDate] = useState(dayjs().format("DD-MM-YYYY"));
  const [endDate, setEndDate] = useState(dayjs().format("DD-MM-YYYY"));

  const [companyIndex, setcompanyIndex] = useState("");
  const [position, setposition] = useState("");
  const [company, setCompany] = useState("");

  const [school, setShool] = useState("");
  const [degree, setDegree] = useState("");
  const [fieldOfStudy, setfieldOfStudy] = useState("");

  const [api, contextHolder] = notification.useNotification();
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
        setAvatar(data.profile?.avatar || ""); // Lưu URL ban đầu
        setIntroduce(data.profile?.introduce || "");
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
    if (modal3Open && id) {
      fetchDataUsers();
    }
  }, [id, modal3Open]);

  // Xử lý upload ảnh
  const handleUpload = ({ fileList }) => {
    if (fileList.length > 0) {
      const file = fileList[0].originFileObj; // Lấy file đầu tiên
      setAvatar(file); // Lưu file để gửi qua FormData
    } else {
      setAvatar(null); // Nếu không có file, đặt lại thành null
    }
  };

  // Xử lý submit dữ liệu
  const handleSave = async () => {
    setLoading(true);
    try {
      const formData = new FormData();

      // Chỉ thêm các trường có giá trị
      if (email) formData.append("email", email);
      if (username) formData.append("username", username);
      if (password) formData.append("password", password);
      if (role) formData.append("role", role);
      if (name) formData.append("name", name);
      if (gender) formData.append("gender", gender);
      if (avatar instanceof File) formData.append("avatar", avatar); // Chỉ gửi file nếu có
      if (birthday) formData.append("birthday", birthday.format("YYYY-MM-DD")); // Định dạng chuẩn ISO
      if (bio) formData.append("bio", bio); // Chỉ gửi nếu bio không rỗng
      if (currentCity) formData.append("currentCity", currentCity);
      if (hometown) formData.append("hometown", hometown);
      if (introduce) formData.append("introduce", introduce);
      if (relationshipStatus)
        formData.append("relationshipStatus", relationshipStatus);
      if (languages) {
        formData.append("languages", languages); // Gửi từng phần tử
      }
      if (websites) {
        formData.append("websites", websites); // Gửi từng phần tử
      }

      let res = await putProfileIntroduce(id, formData); // Gửi FormData
      console.log(res);

      setModal3Open(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
    } finally {
      setLoading(false);
    }
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

  const handlechangeWordCompay = (e) => {
    setCompany(e.target.value);
  };

  const handlechangeWordPostion = (e) => {
    setposition(e.target.value);
  };

  const onChange = (date, dateString) => {
    console.log("Date object:", date);
    console.log("Formatted date string:", dateString);

    if (date) {
      setStartDate(dateString); // Gán giá trị khi có ngày hợp lệ
    } else {
      setStartDate(""); // Xóa giá trị nếu người dùng xóa ngày
    }
  };

  const onChangeEndDate = (date, dateString) => {
    if (date) {
      setEndDate(dateString); // Gán giá trị khi có ngày hợp lệ
    } else {
      setEndDate(""); // Xóa giá trị nếu người dùng xóa ngày
    }
  };

  const HandleCreateWork = async () => {
    try {
      // Gửi API với dữ liệu đã cập nhật
      let res = await HanldeAPICreateWorkUser(
        id,
        company,
        position,
        startDate,
        endDate
      );

      if (res && res.status === 200) {
        setModalopenSchool(false);
        fetchDataUsers();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const HandleCreateEducation = async () => {
    try {
      let res = await HanldeAPICreateEductionkUser(
        id,
        school,
        degree,
        fieldOfStudy,
        startDate,
        endDate
      );
      if (res && res.status === 200) {
        setModalopen(false);
        fetchDataUsers();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleShowOpen = () => {
    setModalopen(true);
  };

  const HandleDeleteEducation = async (educationId) => {
    console.log(id);

    try {
      const res = await HanldeAPIDeleteEducation(id, educationId);

      if (res && res.status === 200) {
        api["success"]({
          message: "Xóa Trường Học Hiện Tại",
          description: "Xóa thành công trường học hiện tại",
        });
        fetchDataUsers();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const HandleDeleteWork = async (workId) => {
    try {
      const res = await HanldeAPIDeleteWord(id, workId);
      console.log(workId);

      console.log(res);

      if (res && res.status === 200) {
        api["success"]({
          message: "Xóa Công Việc Hiện Tại",
          description: "Xóa thành công công việc",
        });
        fetchDataUsers();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenUpdateWork = (
    companyValue,
    positionValue,
    startDateValue,
    endDateValue,
    index
  ) => {
    let formattedStartDate = moment(startDateValue).format("DD-MM-YYYY");
    let formattedEndDate = moment(endDateValue).format("DD-MM-YYYY");
    setCompany(companyValue);
    setposition(positionValue);
    setStartDate(formattedStartDate);
    setEndDate(formattedEndDate);
    setcompanyIndex(index);

    setModalOpenSetting(true);
  };

  const HandleUpdateWorkByConditions = async () => {
    try {
      let res = await APIUpdateWorkByConditions(
        id,
        companyIndex,
        position,
        company
      );
      console.log(res);
      if (res && res.status === 200) {
        api["success"]({
          message: "Sửa Công Việc Hiện Tại",
          description: "Sửa thành công công việc",
        });
        await fetchDataUsers();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      {contextHolder}
      <Modal
        title={
          <span
            style={{ fontSize: "20px", fontWeight: "bold", color: "#1d39c4" }}
          >
            Cập nhật thông tin người dùng
          </span>
        }
        centered
        open={modal3Open}
        onOk={handleSave}
        onCancel={() => setModal3Open(false)}
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
                />
              </div>
            </div>

            <div style={sectionStyle}>
              <label style={labelStyle}>Tiểu sử</label>
              <Input.TextArea
                value={introduce}
                onChange={(e) => setIntroduce(e.target.value)}
                rows={3}
                placeholder="Nhập tiểu sử"
                style={{ ...inputStyle, resize: "none" }}
              />
            </div>
            <div style={sectionStyle}>
              <label style={labelStyle}>Bio</label>
              <Input.TextArea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Nhập bio"
                style={{ ...inputStyle, resize: "none" }}
              />
            </div>

            {/* Ảnh đại diện */}
            <div style={sectionStyle}>
              <label style={labelStyle}>Ảnh đại diện</label>
              <div
                style={{ display: "flex", alignItems: "center", gap: "16px" }}
              >
                {avatar && typeof avatar === "string" && (
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
                  beforeUpload={() => false} // Ngăn upload tự động
                  onChange={handleUpload}
                >
                  <Button
                    icon={<UploadOutlined />}
                    style={{ borderRadius: "8px", background: "#f0f0f0" }}
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
                />
              </div>
              <div>
                <label style={labelStyle}>Quê quán</label>
                <Input
                  value={hometown}
                  onChange={(e) => setHometown(e.target.value)}
                  placeholder="Nhập quê quán"
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

            <div style={sectionStyle}>
              <label style={labelStyle}>Học vấn</label>
              {userData.profile?.education?.length > 0 ? (
                <List
                  dataSource={userData.profile.education}
                  renderItem={(edu) => (
                    <List.Item
                      style={{
                        background: "#fff",
                        borderRadius: "8px",
                        marginBottom: "8px",
                        padding: "12px 16px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      }}
                    >
                      <span
                        style={{ color: "#555", fontSize: "14px", flex: 1 }}
                      >
                        {edu.school} - {edu.degree} {edu.fieldOfStudy}
                      </span>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <Button
                          type="primary"
                          size="small"
                          onClick={(e) => setModalopenSchool(true)}
                        >
                          Thêm
                        </Button>
                        <Button type="primary" size="small">
                          Sửa
                        </Button>
                        <Button
                          danger
                          size="small"
                          onClick={() => HandleDeleteEducation(edu._id)}
                        >
                          Xóa
                        </Button>
                      </div>
                    </List.Item>
                  )}
                  style={{
                    background: "#f0f0f0",
                    padding: "8px",
                    borderRadius: "8px",
                    border: "1px solid #e8e8e8",
                  }}
                />
              ) : (
                <div className="w-full">
                  <Button
                    color="default"
                    variant="solid"
                    className="w-full"
                    onClick={() => setModalopenSchool(true)}
                  >
                    Thêm Trường Học
                  </Button>
                </div>
              )}
            </div>

            <div style={sectionStyle}>
              <label style={labelStyle}>Công việc</label>
              {userData.profile?.work?.length > 0 ? (
                <List
                  dataSource={userData.profile.work}
                  renderItem={(work) => (
                    <List.Item
                      style={{
                        background: "#fff",
                        borderRadius: "8px",
                        marginBottom: "8px",
                        padding: "12px 16px",
                      }}
                    >
                      <span style={{ color: "#555" }}>
                        {work.company} - {work.position}
                      </span>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <Button
                          type="primary"
                          size="small"
                          onClick={() => handleShowOpen()}
                        >
                          Thêm
                        </Button>
                        <Button
                          type="primary"
                          size="small"
                          onClick={() =>
                            handleOpenUpdateWork(
                              work.company,
                              work.position,
                              work.startDate,
                              work.endDate,
                              work._id
                            )
                          }
                        >
                          Sửa
                        </Button>
                        <Button
                          danger
                          size="small"
                          onClick={() => HandleDeleteWork(work._id)}
                        >
                          Xóa
                        </Button>
                      </div>
                    </List.Item>
                  )}
                  style={{
                    background: "#f0f0f0",
                    padding: "8px",
                    borderRadius: "8px",
                  }}
                />
              ) : (
                <div className="w-full">
                  <Button
                    color="default"
                    variant="solid"
                    className="w-full"
                    onClick={() => setModalopen(true)}
                  >
                    Thêm Công Việc
                  </Button>
                </div>
              )}
            </div>

            <Modal
              title="Vertically centered modal dialog"
              centered
              open={modalpenShool}
              onOk={() => setModalopenSchool(false)}
              onCancel={() => setModalopenSchool(false)}
              footer={
                <div className="mt-4">
                  <Button
                    key="cancel"
                    onClick={() => setModalopenSchool(false)}
                  >
                    Hủy
                  </Button>
                  ,
                  <Button
                    key="ok"
                    type="primary"
                    loading={loading}
                    onClick={() => HandleCreateEducation()}
                  >
                    Lưu
                  </Button>
                  ,
                </div>
              }
            >
              <label>Trường Học:</label>
              <TextArea
                showCount
                maxLength={100}
                onChange={(e) => setShool(e.target.value)}
                placeholder=""
                value={school || ""}
              />
              <label className="mt-4">Bằng cấp:</label>
              <TextArea
                showCount
                maxLength={100}
                onChange={(e) => setDegree(e.target.value)}
                placeholder=""
                value={degree || ""}
                className=""
              />
              <label className="mt-4">Ngành học:</label>
              <TextArea
                showCount
                maxLength={100}
                onChange={(e) => setfieldOfStudy(e.target.value)}
                placeholder=""
                value={fieldOfStudy || ""}
                className=""
              />
              <label>Ngày bắt đầu</label>
              <div>
                <DatePicker
                  defaultValue={
                    startDate ? dayjs(startDate, "DD-MM-YYYY") : null
                  }
                  format="DD-MM-YYYY"
                  onChange={onChange}
                  className="w-full"
                />
              </div>
              <label>Ngày kết thúc</label>
              <div>
                <DatePicker
                  defaultValue={endDate ? dayjs(endDate, "DD-MM-YYYY") : null}
                  format="DD-MM-YYYY"
                  onChange={onChangeEndDate}
                  className="w-full"
                />
              </div>
            </Modal>
            <Modal
              title="Thêm  Công Việc"
              centered
              open={modalpen}
              onOk={() => setModalopen(false)}
              onCancel={() => setModalopen(false)}
              footer={
                <div className="mt-4">
                  <Button key="cancel" onClick={() => setModalopen(false)}>
                    Hủy
                  </Button>
                  ,
                  <Button
                    key="ok"
                    type="primary"
                    loading={loading}
                    onClick={() => HandleCreateWork()}
                  >
                    Lưu
                  </Button>
                  ,
                </div>
              }
            >
              <label>Công ty:</label>
              <TextArea
                showCount
                maxLength={100}
                onChange={(e) => handlechangeWordCompay(e)}
                placeholder=""
                value={company || ""}
              />
              <label className="mt-4">Vị trí:</label>
              <TextArea
                showCount
                maxLength={100}
                onChange={(e) => handlechangeWordPostion(e)}
                placeholder=""
                value={position || ""}
                className=""
              />
              <label>Ngày bắt đầu</label>
              <div>
                <DatePicker
                  defaultValue={
                    startDate ? dayjs(startDate, "DD-MM-YYYY") : null
                  }
                  format="DD-MM-YYYY"
                  onChange={onChange}
                  className="w-full"
                />
              </div>
              <label>Ngày kết thúc</label>
              <div>
                <DatePicker
                  defaultValue={endDate ? dayjs(endDate, "DD-MM-YYYY") : null}
                  format="DD-MM-YYYY"
                  onChange={onChangeEndDate}
                  className="w-full"
                />
              </div>
            </Modal>

            <Modal
              title="Sửa Công Việc"
              centered
              open={modalpenSetting}
              onOk={() => setModalOpenSetting(false)}
              onCancel={() => setModalOpenSetting(false)}
              footer={
                <div className="mt-4">
                  <Button
                    key="cancel"
                    onClick={() => setModalOpenSetting(false)}
                  >
                    Hủy
                  </Button>
                  ,
                  <Button
                    key="ok"
                    type="primary"
                    loading={loading}
                    onClick={() => HandleUpdateWorkByConditions()}
                  >
                    Lưu
                  </Button>
                  ,
                </div>
              }
            >
              <label>Công ty:</label>
              <TextArea
                showCount
                maxLength={100}
                onChange={(e) => handlechangeWordCompay(e)}
                placeholder=""
                value={company || ""}
              />
              <label className="mt-4">Vị trí:</label>
              <TextArea
                showCount
                maxLength={100}
                onChange={(e) => handlechangeWordPostion(e)}
                placeholder=""
                value={position || ""}
                className=""
              />
              <label>Ngày bắt đầu</label>
              <div>
                <DatePicker
                  defaultValue={
                    startDate ? dayjs(startDate, "DD-MM-YYYY") : null
                  }
                  format="DD-MM-YYYY"
                  onChange={onChange}
                  className="w-full"
                />
              </div>
              <label>Ngày kết thúc</label>
              <div>
                <DatePicker
                  defaultValue={endDate ? dayjs(endDate, "DD-MM-YYYY") : null}
                  format="DD-MM-YYYY"
                  onChange={onChangeEndDate}
                  className="w-full"
                />
              </div>
            </Modal>
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

export default UpdateUsers;
