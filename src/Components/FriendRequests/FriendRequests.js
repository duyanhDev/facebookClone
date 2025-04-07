// FriendRequests.jsx
import React from "react";

// Giả định API để lấy danh sách lời mời kết bạn
const getFriendRequestsAPI = async (userId) => {
  return {
    data: {
      EC: 0,
      requests: [
        {
          _id: "1",
          userId: {
            _id: "user1",
            profile: {
              name: "Ngọc Anh",
              avatar: "https://i.pravatar.cc/150?img=10",
            },
          },
          createdAt: "2025-04-04T10:00:00Z",
        },
        {
          _id: "2",
          userId: {
            _id: "user2",
            profile: {
              name: "Hoàng Long",
              avatar: "https://i.pravatar.cc/150?img=11",
            },
          },
          createdAt: "2025-04-03T15:30:00Z",
        },
      ],
    },
  };
};

const FriendRequests = ({ currentUserId, onAccept, onDecline }) => {
  const [friendRequests, setFriendRequests] = React.useState([]);
  const [requestLoading, setRequestLoading] = React.useState(true);

  React.useEffect(() => {
    const listFriendRequests = async () => {
      try {
        setRequestLoading(true);
        let res = await getFriendRequestsAPI(currentUserId);
        if (res && res.data && res.data.EC === 0) {
          setFriendRequests(res.data.requests);
        }
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      } finally {
        setRequestLoading(false);
      }
    };

    listFriendRequests();
  }, [currentUserId]);

  return (
    <div className="min-h-[calc(100vh-12rem)] flex flex-col">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
        Lời mời kết bạn
      </h1>
      {requestLoading ? (
        <div className="flex justify-center items-center flex-1">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-500"></div>
        </div>
      ) : friendRequests.length > 0 ? (
        <div className="space-y-6 flex-1 w-96">
          {friendRequests.map((request) => (
            <div
              key={request._id}
              className="flex items-center bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
            >
              <div className="relative">
                <img
                  src={request.userId.profile.avatar}
                  alt={request.userId.profile.name}
                  className="w-14 h-14 rounded-full border-2 border-indigo-300"
                />
                <span className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
              <div className="flex-1 ml-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {request.userId.profile.name}
                </h2>
                <p className="text-sm text-gray-500">
                  Gửi lời mời vào{" "}
                  {new Date(request.createdAt).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onAccept(request._id)}
                  className="bg-indigo-500 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-600 transition duration-200 text-sm font-medium"
                >
                  Chấp nhận
                </button>
                <button
                  onClick={() => onDecline(request._id)}
                  className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-300 transition duration-200 text-sm font-medium"
                >
                  Từ chối
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500 py-10">
            Bạn không có lời mời kết bạn nào.
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendRequests;
