import { Modal, Button, DatePicker, Select } from "antd";
import { FaPen } from "react-icons/fa";
import { CiCirclePlus } from "react-icons/ci";
import dayjs from "dayjs";
import moment from "moment";
import { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import {
  APIUpdateWorkByConditions,
  HanldeAPICreateEductionkUser,
  HanldeAPICreateWorkUser,
  putProfileIntroduce,
  UpdateEducationAPI,
} from "../../service/apiAxios";
import { Option } from "antd/es/mentions";
const SettingProfile = ({
  open,
  setOpen,
  loading,
  profile,
  listProfileUser,
}) => {
  const userId = localStorage.getItem("id");
  const id = localStorage.getItem("id");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [hometown, setHometown] = useState("");
  const [currentCity, setCurrentCity] = useState("");
  const [gender, setGender] = useState("");
  const [relationshipStatusMap, SetRelationshipStatusMap] = useState("");
  const [birthday, setBirtDay] = useState(null);
  const password = "";
  const [school, setSchool] = useState("");
  const [degree, setDegrees] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [startDate, setStartDate] = useState(dayjs().format("DD-MM-YYYY"));
  const [endDate, setEndDate] = useState(dayjs().format("DD-MM-YYYY"));
  const [startDate1, setStartDate1] = useState(dayjs().format("DD-MM-YYYY"));
  const [endDate1, setEndDate1] = useState(dayjs().format("DD-MM-YYYY"));
  const [current, setCurrent] = useState(false);
  const [educationIndex, seteducationIndex] = useState("");

  const [position, setposition] = useState("");
  const [company, setCompany] = useState("");
  const [companyIndex, setCompanyIndex] = useState("");

  const [isWork, setIsWork] = useState(false);
  const [isCreateWork, setIsCreateWork] = useState(false);

  const [isEducation, setIsEducation] = useState(false);

  const [open10, setOpen10] = useState(false);
  const [introduce, setIntroduce] = useState("");
  const [avatar, setAvatar] = useState(null);
  const role = "user";
  const [languages, setLanguages] = useState([]);
  const [websites, setWebsites] = useState([]);
  const [bio, setBio] = useState("");

  const [name, setName] = useState("");

  const [editingField, setEditingField] = useState(null);

  const inputStyle = {
    borderRadius: "8px",
    padding: "8px",
    border: "1px solid #d9d9d9",
    width: "100%",
  };

  const relationshipStatus = (value) => {
    console.log("xxx", value);

    switch (value) {
      case "Single":
        return "Độc thân";
      case "In a relationship":
        return "Đang hẹn hò";
      case "Engaged":
        return "Đã đính hôn";
      case "Married":
        return "Đã kết hôn";
      case "Complicated":
        return "Mối quan hệ phức tạp";
      case "Divorced":
        return "Đã ly hôn";
      case "Widowed":
        return "Góa";
      default:
        return "Không xác định";
    }
  };

  useEffect(() => {
    if (profile?.profile) {
      setHometown(profile.profile.hometown || "");
      setCurrentCity(profile.profile.currentCity || "");
      setGender(profile.profile.gender || "");
      SetRelationshipStatusMap(profile.profile.relationshipStatus || "");
      setBirtDay(
        profile.profile?.birthday ? moment(profile.profile.birthday) : null
      );
      setEmail(profile.email || "");
      setUsername(profile.username || "");
      setIntroduce(profile.profile?.introduce || "");
      setLanguages(profile.profile?.languages || []);
      setWebsites(profile.profile?.websites || []);
      setName(profile.profile?.name || "");
      setAvatar(profile.profile?.avatar || "");
    }
  }, [profile, id]);

  const handlechangeWordCompay = (e) => {
    setCompany(e.target.value);
  };

  const handlechangeWordPostion = (e) => {
    setposition(e.target.value);
  };

  const OnClickIsword = (position, company, companyIndex) => {
    setposition(position);
    setCompany(company);
    setCompanyIndex(companyIndex);
    setIsWork(true);
  };

  const HandleUpdateWorkByConditions = async () => {
    try {
      let res = await APIUpdateWorkByConditions(
        userId,
        companyIndex,
        position,
        company
      );
      console.log(res);
      if (res && res.status === 200) {
        setIsWork(false);
        await listProfileUser();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onChange = (date, dateString) => {
    console.log("Date object:", date);
    console.log("Formatted date string:", dateString);

    if (date) {
      setStartDate1(dateString); // Gán giá trị khi có ngày hợp lệ
    } else {
      setStartDate1(""); // Xóa giá trị nếu người dùng xóa ngày
    }
  };

  const onChangeEndDate = (date, dateString) => {
    if (date) {
      setEndDate1(dateString); // Gán giá trị khi có ngày hợp lệ
    } else {
      setEndDate1(""); // Xóa giá trị nếu người dùng xóa ngày
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
        setIsCreateWork(false);
        await listProfileUser();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const HandleCreateEducation = async () => {
    try {
      // Gửi API với dữ liệu đã cập nhật
      let res = await HanldeAPICreateEductionkUser(
        id,
        school,
        degree,
        fieldOfStudy,
        startDate1,
        endDate1,
        current
      );

      if (res && res.status === 200) {
        setOpen10(false);
        await listProfileUser();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeEducation = (id, school, degree, fieldOfStudy) => {
    setSchool(school);
    setDegrees(degree);
    setFieldOfStudy(fieldOfStudy);
    seteducationIndex(id);
    setIsEducation(true);
  };

  const handleEditClick = (field) => {
    setEditingField(field);
  };

  // Hàm xử lý khi thay đổi giá trị
  const handleChange = (setter) => (e) => {
    setter(e.target.value);
  };

  // Hàm xử lý khi nhấn Enter hoặc mất focus để lưu giá trị
  const handleBlurOrEnter = (e) => {
    if (e.type === "blur" || e.key === "Enter") {
      setEditingField(null); // Ẩn input sau khi hoàn tất
    }
  };

  const relationshipOptions = [
    { value: "Single", label: "Độc thân" },
    { value: "In a relationship", label: "Đang hẹn hò" },
    { value: "Engaged", label: "Đã đính hôn" },
    { value: "Married", label: "Đã kết hôn" },
    { value: "Complicated", label: "Mối quan hệ phức tạp" },
    { value: "Divorced", label: "Đã ly hôn" },
    { value: "Widowed", label: "Góa" },
  ];

  const OnUpdateEducation = async () => {
    try {
      let res = await UpdateEducationAPI(
        id,
        educationIndex,
        school,
        degree,
        fieldOfStudy,
        startDate1,
        endDate1
      );
      if (res && res.status === 200) {
        setIsEducation(false);
        await listProfileUser();
      }
    } catch (error) {}
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();

      console.log("email:", email);
      console.log("username:", username);
      console.log("hometown:", hometown);
      console.log("currentCity:", currentCity);
      console.log("gender:", gender);
      console.log("relationshipStatusMap:", relationshipStatusMap);
      console.log("birthday:", birthday ? birthday.format("YYYY-MM-DD") : null);

      if (email) formData.append("email", email);
      if (username) formData.append("username", username);
      if (password) formData.append("password", password);
      if (role) formData.append("role", role);
      if (name) formData.append("name", name);
      if (gender) formData.append("gender", gender);
      if (avatar instanceof File) formData.append("avatar", avatar);
      if (birthday && birthday.isValid())
        formData.append("birthday", birthday.format("YYYY-MM-DD"));
      if (bio) formData.append("bio", bio);
      if (currentCity) formData.append("currentCity", currentCity);
      if (hometown) formData.append("hometown", hometown);
      if (introduce) formData.append("introduce", introduce);
      if (relationshipStatusMap)
        formData.append("relationshipStatus", relationshipStatusMap);
      if (languages && languages.length > 0) {
        languages.forEach((lang, index) => {
          formData.append(`languages[${index}]`, lang);
        });
      }
      if (websites && websites.length > 0) {
        websites.forEach((site, index) => {
          formData.append(`websites[${index}]`, site);
        });
      }

      // Kiểm tra nội dung FormData
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      let res = await putProfileIntroduce(id, formData);
      console.log("Response:", res);
      if (res && res.status === 200) {
        await listProfileUser();
        setOpen(false);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
    }
  };

  const genderStatus = (value) => {
    switch (value) {
      case "male":
        return "Nam";
      case "female":
        return "Nữ";
      case "Khác":
        return "Góa";
      default:
        return "Không xác định";
    }
  };

  console.log(gender);

  const genderOptions = [
    { value: "male", label: "Nam" },
    { value: "female", label: "Nữ" },
    { value: "other", label: "Khác" },
  ];

  return (
    <div>
      <Modal
        title={<p className="text-center">Chỉnh sửa chi tiết</p>}
        centered
        loading={loading}
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        footer={
          <div className="mt-8">
            <Button key="cancel" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            ,
            <Button
              key="ok"
              type="primary"
              loading={loading}
              onClick={() => handleSave()}
            >
              Cập nhật
            </Button>
            ,
          </div>
        }
      >
        <div className="py-3">
          <label className="font-bold text-sm">Công việc</label>
          {profile.profile &&
            profile.profile.work.length > 0 &&
            profile.profile.work.map((item, index) => {
              return (
                <div
                  className="flex gap-2 justify-between items-center mt-2 "
                  key={item._id}
                >
                  {isWork && (
                    <Modal
                      title={
                        <p className="text-center">
                          Chỉnh sửa thông tin công việc
                        </p>
                      }
                      centered
                      loading={loading}
                      open={isWork}
                      onCancel={() => setIsWork(false)}
                      footer={
                        <div className="mt-8">
                          <Button key="cancel" onClick={() => setIsWork(false)}>
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
                    </Modal>
                  )}
                  <p>
                    {item.position} - {item.company}
                  </p>

                  <FaPen
                    className="cursor-pointer"
                    onClick={() =>
                      OnClickIsword(item.position, item.company, item._id)
                    }
                  />
                </div>
              );
            })}
          <span
            className="flex items-center gap-2 cursor-pointer mt-2"
            onClick={() => setIsCreateWork(true)}
          >
            <CiCirclePlus className="text-xl" /> Thêm công việc mới
          </span>
          <Modal
            title={<p className="text-center">Thêm công việc</p>}
            centered
            loading={loading}
            open={isCreateWork}
            onOk={() => setIsCreateWork(false)}
            onCancel={() => setIsCreateWork(false)}
            footer={
              <div className="mt-4">
                <Button key="cancel" onClick={() => setIsWork(false)}>
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
                defaultValue={startDate ? dayjs(startDate, "DD-MM-YYYY") : null}
                format="DD-MM-YYYY"
                onChange={onChangeEndDate}
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
        <div className="">
          <label className="font-bold text-sm">Học vấn</label>
          {profile.profile &&
            profile.profile.education.length > 0 &&
            profile.profile.education.map((item, index) => {
              return (
                <div
                  className="flex gap-2 justify-between items-center mt-2 "
                  key={item._id}
                >
                  <Modal
                    title={
                      <p className="text-center">Chỉnh sửa thông tin học tập</p>
                    }
                    centered
                    loading={loading}
                    open={isEducation}
                    onCancel={() => setIsEducation(false)}
                    footer={
                      <div className="mt-8">
                        <Button
                          key="cancel"
                          onClick={() => setIsEducation(false)}
                        >
                          Hủy
                        </Button>
                        ,
                        <Button
                          key="ok"
                          type="primary"
                          loading={loading}
                          onClick={() => OnUpdateEducation()}
                        >
                          Lưu
                        </Button>
                        ,
                      </div>
                    }
                  >
                    <label>Tên trường học:</label>
                    <TextArea
                      showCount
                      maxLength={100}
                      onChange={(e) => setSchool(e.target.value)}
                      placeholder=""
                      value={school || ""}
                    />
                    <label className="mt-4">Bằng cấp:</label>
                    <TextArea
                      showCount
                      maxLength={100}
                      onChange={(e) => setDegrees(e.target.value)}
                      placeholder=""
                      value={degree || ""}
                      className=""
                    />

                    <label className="mt-4">Ngành học:</label>
                    <TextArea
                      showCount
                      maxLength={100}
                      onChange={(e) => setFieldOfStudy(e.target.value)}
                      placeholder=""
                      value={fieldOfStudy || ""}
                      className=""
                    />
                    <label>Ngày bắt đầu</label>
                    <div>
                      <DatePicker
                        defaultValue={
                          startDate1 ? dayjs(startDate1, "DD-MM-YYYY") : null
                        }
                        format="DD-MM-YYYY"
                        onChange={onChange}
                        className="w-full"
                      />
                    </div>
                    <label>Ngày kết thúc</label>
                    <div>
                      <DatePicker
                        defaultValue={
                          endDate1 ? dayjs(endDate1, "DD-MM-YYYY") : null
                        }
                        format="DD-MM-YYYY"
                        onChange={onChangeEndDate}
                        className="w-full"
                      />
                    </div>
                  </Modal>
                  <p>
                    {item.school} - {item.fieldOfStudy}
                  </p>
                  <FaPen
                    className="cursor-pointer"
                    onClick={() =>
                      handleChangeEducation(
                        item._id,
                        item.school,
                        item.degree,
                        item.fieldOfStudy
                      )
                    }
                  />
                </div>
              );
            })}
          <span
            className="flex items-center gap-2 cursor-pointer mt-2"
            onClick={() => setOpen10(true)}
          >
            <CiCirclePlus className="text-xl" /> Thêm trường học
          </span>

          <Modal
            title={<p className="text-center">Thêm trường học</p>}
            centered
            loading={loading}
            open={open10}
            onOk={() => setOpen10(false)}
            onCancel={() => setOpen10(false)}
            footer={
              <div className="mt-4">
                <Button key="cancel" onClick={() => setIsWork(false)}>
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
            <label>Tên trường học:</label>
            <TextArea
              showCount
              maxLength={100}
              onChange={(e) => setSchool(e.target.value)}
              placeholder=""
              value={school || ""}
            />
            <label className="mt-4">Bằng cấp:</label>
            <TextArea
              showCount
              maxLength={100}
              onChange={(e) => setDegrees(e.target.value)}
              placeholder=""
              value={degree || ""}
              className=""
            />

            <label className="mt-4">Ngành học:</label>
            <TextArea
              showCount
              maxLength={100}
              onChange={(e) => setFieldOfStudy(e.target.value)}
              placeholder=""
              value={fieldOfStudy || ""}
              className=""
            />
            <label>Ngày bắt đầu</label>
            <div>
              <DatePicker
                defaultValue={
                  startDate1 ? dayjs(startDate1, "DD-MM-YYYY") : null
                }
                format="DD-MM-YYYY"
                onChange={onChange}
                className="w-full"
              />
            </div>
            <label>Ngày kết thúc</label>
            <div>
              <DatePicker
                defaultValue={endDate1 ? dayjs(endDate1, "DD-MM-YYYY") : null}
                format="DD-MM-YYYY"
                onChange={onChangeEndDate}
                className="w-full"
              />
            </div>
          </Modal>
        </div>
        <div className="mt-2">
          <label className="font-bold text-sm">Tỉnh/Thành phố hiện tại</label>
          {editingField === "currentCity" ? (
            <TextArea
              value={currentCity}
              onChange={handleChange(setCurrentCity)}
              onBlur={handleBlurOrEnter}
              onKeyDown={handleBlurOrEnter}
              autoFocus
              className="mt-2"
            />
          ) : (
            <p className="flex items-center justify-between gap-2 cursor-pointer mt-2">
              Sống tại{" "}
              {currentCity || (profile.profile && profile.profile.currentCity)}
              <FaPen
                className="cursor-pointer"
                onClick={() => handleEditClick("currentCity")}
              />
            </p>
          )}
        </div>

        <div className="mt-2">
          <label className="font-bold text-sm">Quê quán</label>
          {editingField === "hometown" ? (
            <TextArea
              value={hometown}
              onChange={handleChange(setHometown)}
              onBlur={handleBlurOrEnter}
              onKeyDown={handleBlurOrEnter}
              autoFocus
              className="mt-2"
            />
          ) : (
            <p className="flex items-center justify-between gap-2 cursor-pointer mt-2">
              Đến từ {hometown || (profile.profile && profile.profile.hometown)}
              <FaPen
                className="cursor-pointer"
                onClick={() => handleEditClick("hometown")}
              />
            </p>
          )}
        </div>

        <div className="mt-2">
          <label className="font-bold text-sm">Mối quan hệ</label>
          {editingField === "relationshipStatus" ? (
            <Select
              value={relationshipStatusMap}
              onChange={(value) => {
                SetRelationshipStatusMap(value); // Cập nhật giá trị khi chọn
                setEditingField(null); // Ẩn Select sau khi chọn
              }}
              className="w-full mt-2"
              placeholder="Chọn trạng thái mối quan hệ"
              autoFocus
            >
              {relationshipOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          ) : (
            <p className="flex items-center justify-between gap-2 cursor-pointer mt-2">
              {(profile.profile &&
                profile &&
                profile.profile?.relationshipStatus) ||
              relationshipStatusMap
                ? relationshipStatus(profile.profile.relationshipStatus)
                : relationshipStatus(relationshipStatusMap)}
              <FaPen
                className="cursor-pointer"
                onClick={() => handleEditClick("relationshipStatus")}
              />
            </p>
          )}
        </div>

        <div className="mt-2">
          <label className="font-bold text-sm">Giới tính</label>
          {editingField === "gender" ? (
            <Select
              value={gender}
              onChange={(value) => {
                setGender(value); // Cập nhật giá trị khi chọn
                setEditingField(null); // Ẩn Select sau khi chọn
              }}
              className="w-full mt-2"
              placeholder="Chọn giới tính"
              autoFocus
            >
              {genderOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          ) : (
            <p className="flex items-center justify-between gap-2 cursor-pointer mt-2">
              {profile.profile && profile.profile.gender && gender
                ? genderStatus(profile.profile.gender)
                : genderStatus(gender)}
              <FaPen
                className="cursor-pointer"
                onClick={() => handleEditClick("gender")}
              />
            </p>
          )}
        </div>

        <div className="mt-2">
          <label className="font-bold text-sm">Ngày sinh nhật</label>
          {editingField === "birthday" ? (
            <DatePicker
              value={birthday}
              onChange={(date) => setBirtDay(date)}
              format="DD/MM/YYYY"
              style={{ ...inputStyle, padding: "4px 11px" }}
            />
          ) : (
            <p className="flex items-center justify-between gap-2 cursor-pointer mt-2">
              {birthday
                ? birthday.format("DD/MM/YYYY")
                : profile.profile &&
                  moment(profile.profile.birthday).format("DD/MM/YYYY")}
              <FaPen
                className="cursor-pointer"
                onClick={() => handleEditClick("birthday")}
              />
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default SettingProfile;
