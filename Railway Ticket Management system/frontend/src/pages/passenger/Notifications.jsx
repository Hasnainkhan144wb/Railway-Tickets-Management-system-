import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout";
import {
  FaBell,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaExclamationTriangle,
  FaTrash,
  FaCheckDouble
} from "react-icons/fa";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem("token");

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data.notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAllRead = async () => {
    try {
      await axios.put(
        "http://localhost:5000/api/notifications/mark-read",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchNotifications();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/notifications/${id}/mark-read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const getIcon = (title) => {
    const t = title?.toLowerCase() || "";
    if (t.includes("booked") || t.includes("success")) {
      return <FaCheckCircle className="text-green-500 text-2xl" />;
    }
    if (t.includes("received") || t.includes("payment")) {
      return <FaCheckCircle className="text-blue-500 text-2xl" />;
    }
    if (t.includes("verified")) {
      return <FaCheckCircle className="text-teal-500 text-2xl" />;
    }
    if (t.includes("delayed") || t.includes("delay")) {
      return <FaExclamationTriangle className="text-yellow-500 text-2xl" />;
    }
    if (t.includes("cancelled") || t.includes("cancel")) {
      return <FaTimesCircle className="text-red-500 text-2xl" />;
    }
    return <FaInfoCircle className="text-blue-400 text-2xl" />;
  };

  const hasUnread = notifications.some((n) => !n.read);

  return (
    <DashboardLayout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Notifications</h1>
          <p className="text-gray-500 mt-2">
            Stay updated with your bookings and train status schedules.
          </p>
        </div>
        {hasUnread && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 bg-green-900 hover:bg-green-800 text-white px-4 py-2.5 rounded-xl shadow transition duration-200 cursor-pointer text-sm font-semibold"
          >
            <FaCheckDouble size={14} />
            Mark All as Read
          </button>
        )}
      </div>

      <div className="bg-white shadow-md rounded-2xl p-6 border max-w-4xl mx-auto">
        {notifications.length === 0 ? (
          <div className="text-center py-16 text-gray-500 flex flex-col items-center">
            <FaBell className="text-5xl text-gray-300 mb-4" />
            <p className="text-lg font-semibold">All caught up!</p>
            <p className="text-sm mt-1">You have no notifications at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notif) => (
              <div
                key={notif._id}
                onClick={() => {
                  if (!notif.read) markAsRead(notif._id);
                }}
                className={`p-4 rounded-xl border flex gap-4 items-start transition duration-200 cursor-pointer ${
                  !notif.read
                    ? "bg-green-50/30 border-green-100 hover:bg-green-50/50"
                    : "bg-white hover:bg-gray-50/80 border-gray-100"
                }`}
              >
                <div className="mt-0.5">{getIcon(notif.title)}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-start gap-4">
                    <h3
                      className={`text-base ${
                        !notif.read ? "font-bold text-gray-900" : "font-medium text-gray-700"
                      }`}
                    >
                      {notif.title}
                    </h3>
                    <span className="text-xs text-gray-400 whitespace-nowrap mt-0.5">
                      {new Date(notif.createdAt).toLocaleDateString()}{" "}
                      {new Date(notif.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                </div>
                {!notif.read && (
                  <span className="w-2.5 h-2.5 rounded-full bg-green-600 self-center" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
