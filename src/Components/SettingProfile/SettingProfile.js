import { Modal, Button, DatePicker } from "antd";
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
} from "../../service/apiAxios";
const SettingProfile = ({
  open,
  setOpen,
  loading,
  profile,
  listProfileUser,
}) => {
  const userId = localStorage.getItem("id");
  const id = localStorage.getItem("id");
  const [hometown, setHometown] = useState("");
  const [currentCity, setCurrentCity] = useState("");
  const [gender, setGender] = useState("");
  const [relationshipStatusMap, SetRelationshipStatusMap] = useState("");
  const [birthday, setBirtDay] = useState("");

  const [Mapschool, setMapschool] = useState([]);
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

  const [open10, setOpen10] = useState(false);
  const dateFormatList = ["DD/MM/YYYY"];

  const [profileUser, SetProfileUsers] = useState({
    email: "",
    username: "",
    password: "",
    role: "",
    name: "",
    gender: "",
    birthday: "",
    bio: "",
    currentCity: "",
    hometown: "",
    introduce: "",
    relationshipStatus: "",
    languages: [],
    websites: [],
    school: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    current: false,
    educationIndex: null,
    company: "",
    position: "",
    startDate1: "",
    endDate1: "",
    current1: false,
  });

  const relationshipStatus = (value) => {
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
      setBirtDay(profile.profile.birthday || "");
    }
  }, [profile]);

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
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Modal
        title={<p className="text-center">Chỉnh sửa chi tiết</p>}
        centered
        loading={loading}
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
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
                  {isWork ? (
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
                  ) : (
                    <p>
                      {item.position} - {item.company}
                    </p>
                  )}
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
                  <p>
                    {item.school} - {item.fieldOfStudy}
                  </p>
                  <FaPen className="cursor-pointer" />
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
          <p className="flex items-center justify-between gap-2 cursor-pointer mt-2">
            Sống tại {profile.profile && profile.profile.hometown}
            <FaPen className="cursor-pointer" />
          </p>
        </div>

        <div className="mt-2">
          <label className="font-bold text-sm">Quê quán</label>

          <p className="flex items-center justify-between gap-2 cursor-pointer mt-2">
            Đến từ {profile.profile && profile.profile.currentCity}
            <FaPen className="cursor-pointer" />
          </p>
        </div>

        <div className="mt-2">
          <label className="font-bold text-sm">Mối quan hệ</label>

          <p className="flex items-center justify-between gap-2 cursor-pointer mt-2">
            {profile.profile &&
              profile.profile.relationshipStatus &&
              relationshipStatus(profile.profile.relationshipStatus)}
            <FaPen className="cursor-pointer" />
          </p>
        </div>

        <div className="mt-2">
          <label className="font-bold text-sm">Giới tính</label>

          <p className="flex items-center justify-between gap-2 cursor-pointer mt-2">
            {profile.profile && profile.profile.gender}
            <FaPen className="cursor-pointer" />
          </p>
        </div>
        <div className="mt-2">
          <label className="font-bold text-sm">Ngày sinh nhật</label>

          <p className="flex items-center justify-between gap-2 cursor-pointer mt-2">
            {profile.profile &&
              moment(profile.profile.birthday).format("DD/MM/YYYY")}
            <FaPen className="cursor-pointer" />
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default SettingProfile;
