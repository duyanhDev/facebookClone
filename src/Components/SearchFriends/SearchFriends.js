import "./SearchFriends.scss";
import avtart from "./../../asset/images/2.png";
import { useEffect, useRef } from "react";
const SearchFriends = ({ friends, hiddenSearch }) => {
  return (
    <>
      {hiddenSearch && (
        <div className="search_item">
          <div className="mt-2 mx-3 flex justify-between">
            <p className="cursor-pointer font-bold">Mới đây</p>
            <p className="cursor-pointer ">Chỉnh sửa</p>
          </div>

          {friends &&
            friends.length &&
            friends.map((item, index) => {
              return (
                <div className="flex items-center gap-4 mt-3" key={item._id}>
                  <img
                    className="w-12 h-12 rounded-full object-cover"
                    src={item.profile.avatar ? item.profile.avatar : avtart}
                    alt="ảnh bạn bè lỗi"
                  />
                  <p>{item.profile.name}</p>
                </div>
              );
            })}
        </div>
      )}
    </>
  );
};

export default SearchFriends;
