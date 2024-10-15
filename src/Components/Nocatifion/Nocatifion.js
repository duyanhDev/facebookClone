import { IoEllipsisHorizontal } from "react-icons/io5";
import "./Nocatifion.scss";
import { Button } from "antd";

const Nocatifion = ({ showNocatfion, setShowNocatfion, dataNocatifion }) => {
  const getTimeAgoInMinutes = (postTime) => {
    const now = new Date(); // Current time
    const postDate = new Date(postTime); // Convert postTime to Date object

    const diffInMilliseconds = now - postDate;
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60)); // Convert milliseconds to minutes

    if (diffInMinutes === 0) {
      return "vừa xong";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`;
    } else if (diffInMinutes < 1440) {
      // Less than a day
      const diffInHours = Math.floor(diffInMinutes / 60);
      return `${diffInHours} giờ trước`;
    } else if (diffInMinutes < 10080) {
      // Less than a week (7 days)
      const diffInDays = Math.floor(diffInMinutes / 1440);
      return `${diffInDays} ngày trước`;
    } else {
      // More than a week
      const diffInWeeks = Math.floor(diffInMinutes / 10080);
      return `${diffInWeeks} tuần trước`;
    }
  };

  return (
    <>
      {showNocatfion && (
        <div className="nocatifion">
          <div className="flex justify-between mx-3 mt-2 items-center">
            <span className="font-bold text-xl whitespace-nowrap">
              Thông báo
            </span>
            <IoEllipsisHorizontal className="text-xl" />
          </div>
          <div className="flex gap-4 ml-3 mt-2">
            <Button>Tất cả</Button>
            <Button>Chưa đọc</Button>
          </div>

          {dataNocatifion &&
            dataNocatifion.map((item, index) => {
              return (
                <div className="flex items-center gap-3 mt-2 ml-3" key={index}>
                  <img
                    className="w-20 h-20 rounded-full object-cover"
                    src={item.sender.avatar}
                    alt="Avatar"
                  />
                  <div className="">
                    <div className=" flex gap-2">
                      {item.seen ? (
                        <p className="text-[#65676B]">
                          {`${item.sender.name} đã đăng bài viết với nội dung "${item.postId.content}"`}
                        </p>
                      ) : item.type === "new_post" ? (
                        <p className="">
                          <span className="font-bold">{`${item.sender.name}`}</span>{" "}
                          đã đăng bài viết với nội dung "{item.postId.content}"
                        </p>
                      ) : (
                        <p className="">
                          <span className="font-bold">{`${item.sender.name}`}</span>{" "}
                          đã nhắc đến bạn trong bình luận của họ
                        </p>
                      )}
                      {!item.seen && (
                        <div className="blue-rounderNocatifion"></div>
                      )}
                    </div>
                    {item.seen ? (
                      <p>{getTimeAgoInMinutes(item.updatedAt)}</p>
                    ) : (
                      <p className="text-blue-700">
                        {getTimeAgoInMinutes(item.updatedAt)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </>
  );
};

export default Nocatifion;
