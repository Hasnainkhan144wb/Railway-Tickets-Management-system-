import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import axios from "axios";

const Topbar = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    if (!user || user.role !== "passenger") return;
    try {
      const res = await axios.get("http://localhost:5000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data.notifications.slice(0, 5));
    } catch (err) {
      console.log("Error fetching notifications:", err);
    }
  };

  const fetchUnreadCount = async () => {
    if (!user || user.role !== "passenger") return;
    try {
      const res = await axios.get("http://localhost:5000/api/notifications/unread-count", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUnreadCount(res.data.count);
    } catch (err) {
      console.log("Error fetching unread count:", err);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    if (user?.role === "passenger") {
      fetchNotifications();
    }
  }, []);

  useEffect(() => {
    if (user?.role !== "passenger") return;
    const interval = setInterval(() => {
      fetchUnreadCount();
      if (isOpen) {
        fetchNotifications();
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBellClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      fetchNotifications();
      fetchUnreadCount();
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/${id}/mark-read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
      fetchUnreadCount();
    } catch (err) {
      console.log("Error marking notification as read:", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/mark-read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
      fetchUnreadCount();
    } catch (err) {
      console.log("Error marking all read:", err);
    }
  };

  return (
    <div className="bg-white shadow p-4 flex justify-between items-center relative">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      <div className="flex items-center gap-6">
        {/* Passenger Notification Bell */}
        {user?.role === "passenger" && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={handleBellClick}
              className="text-gray-600 hover:text-green-950 transition relative p-2 focus:outline-none cursor-pointer flex items-center justify-center"
            >
              <FaBell className="text-2xl" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown */}
            {isOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-250 rounded-xl shadow-xl z-50 overflow-hidden">
                <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b">
                  <span className="font-semibold text-gray-700">Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs text-green-700 hover:text-green-900 font-semibold cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-6 text-center text-gray-500 text-sm">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif._id}
                        className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition flex flex-col cursor-pointer ${
                          !notif.read ? "bg-green-50/40" : ""
                        }`}
                        onClick={() => {
                          if (!notif.read) {
                            handleMarkAsRead(notif._id);
                          }
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <span className={`text-sm ${!notif.read ? "font-bold text-gray-900" : "text-gray-700"}`}>
                            {notif.title}
                          </span>
                          {!notif.read && (
                            <span className="w-2 h-2 rounded-full bg-green-600 mt-1.5" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{notif.message}</p>
                        <span className="text-[10px] text-gray-400 mt-1.5">
                          {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                <Link
                  to="/notifications"
                  onClick={() => setIsOpen(false)}
                  className="block text-center py-2 text-sm text-green-800 hover:text-green-900 bg-gray-50 border-t font-semibold"
                >
                  View All Notifications
                </Link>
              </div>
            )}
          </div>
        )}

        <div className="text-right">
          <p className="font-semibold">{user?.name}</p>
          <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
        </div>
      </div>
    </div>
  );
};

export default Topbar;