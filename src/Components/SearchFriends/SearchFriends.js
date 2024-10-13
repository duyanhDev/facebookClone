import "./SearchFriends.scss";
import avtart from "./../../asset/images/2.png";
import ClipLoader from "react-spinners/ClipLoader";
const SearchFriends = ({ friends, hiddenSearch, isLoading }) => {
  return (
    <>
      {isLoading ? (
        <div className="search_item1 justify-center flex items-center">
          <ClipLoader color="#e7caaa" />
        </div>
      ) : (
        <>
          {hiddenSearch && (
            <div className="search_item">
              <div className="mt-2 mx-3 flex justify-between">
                <p className="cursor-pointer font-bold">Mới đây</p>
                <p className="cursor-pointer ">Chỉnh sửa</p>
              </div>

              {friends && friends.length > 0 ? (
                friends.map((item, index) => {
                  return (
                    <div
                      className="flex items-center gap-4 mt-3 mx-3 cursor-pointer"
                      key={item._id}
                    >
                      <img
                        className="w-12 h-12 rounded-full object-cover"
                        src={item.profile.avatar ? item.profile.avatar : avtart}
                        alt="ảnh bạn bè lỗi"
                      />
                      <p className="">{item.profile.name}</p>
                    </div>
                  );
                })
              ) : (
                <p className="flex justify-center items-center">
                  Không tìm thấy kết quả
                </p>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default SearchFriends;
