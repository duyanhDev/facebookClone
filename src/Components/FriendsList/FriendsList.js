// FriendsList.jsx
import { Link, Outlet, useLocation } from "react-router-dom";

export const FriendsList = () => {
  const location = useLocation(); // Để highlight tab dựa trên route hiện tại

  return (
    <div className="h-screen flex bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Navigation Left */}
      <div className="w-64 bg-white shadow-xl border-r border-gray-200 p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
          <svg
            className="w-6 h-6 text-indigo-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            ></path>
          </svg>
          Quản lý bạn bè
        </h2>
        <ul className="space-y-3">
          <li>
            <Link
              to="requests"
              className={`flex items-center gap-3 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 p-3 rounded-lg transition duration-300 ${
                location.pathname.includes("requests")
                  ? "bg-indigo-50 text-indigo-600"
                  : ""
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                ></path>
              </svg>
              Lời mời kết bạn
            </Link>
          </li>
          <li>
            <Link
              to=""
              className={`flex items-center gap-3 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 p-3 rounded-lg transition duration-300 ${
                location.pathname.includes("")
                  ? "bg-indigo-50 text-indigo-600"
                  : ""
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                ></path>
              </svg>
              Tất cả bạn bè
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default FriendsList;
