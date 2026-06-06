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
  FaCheckDouble,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaEye,
  FaEyeSlash,
  FaBolt
} from "react-icons/fa";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [notifToDelete, setNotifToDelete] = useState(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const token = localStorage.getItem("token");

  // Fetch notifications
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

  // Mark all read
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

  // Toggle read status
  const toggleRead = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/notifications/${id}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchNotifications();
      // Update local detail view if open
      if (selectedNotif && selectedNotif._id === id) {
        setSelectedNotif(prev => ({ ...prev, read: !prev.read }));
      }
    } catch (error) {
      console.error("Error toggling read status:", error);
    }
  };

  // Delete notification
  const deleteNotif = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifToDelete(null);
      if (selectedNotif && selectedNotif._id === id) {
        setSelectedNotif(null);
      }
      fetchNotifications();
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  // Clear all notifications
  const clearAllNotifications = async () => {
    try {
      await axios.delete("http://localhost:5000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowClearConfirm(false);
      setSelectedNotif(null);
      fetchNotifications();
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  // Simulated live event dispatcher (adds temporary alerts for delays, schedules, etc.)
  const simulateLiveAlert = () => {
    const mockAlerts = [
      {
        _id: `temp_${Math.random()}`,
        title: "⚠️ Train Schedule Delay Notice",
        message: "Tezgam Express (Karachi-Lahore route) is delayed by 45 minutes due to maintenance on track sector A.",
        read: false,
        createdAt: new Date().toISOString()
      },
      {
        _id: `temp_${Math.random()}`,
        title: "🎫 Ticket Reservation Confirmed",
        message: "Success! Your payment of Rs. 1,800 has been verified. Check your upcoming trips in the dashboard.",
        read: false,
        createdAt: new Date().toISOString()
      },
      {
        _id: `temp_${Math.random()}`,
        title: "💳 Payment Invoice Received",
        message: "Challan invoice #PAY-8832049 has been successfully generated. Please authorize before reservation window expires.",
        read: false,
        createdAt: new Date().toISOString()
      },
      {
        _id: `temp_${Math.random()}`,
        title: "📢 System Maintenance update",
        message: "The online booking system will undergo minor optimizations on Sunday between 2:00 AM and 4:00 AM.",
        read: false,
        createdAt: new Date().toISOString()
      }
    ];

    const randomAlert = mockAlerts[Math.floor(Math.random() * mockAlerts.length)];
    setNotifications((prev) => [randomAlert, ...prev]);
  };

  // Fetch on mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Poll for real-time notifications in backend every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotifications();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Filter categorization logic
  const getNotificationType = (title) => {
    const t = title?.toLowerCase() || "";
    if (t.includes("book") || t.includes("ticket") || t.includes("reservation")) return "booking";
    if (t.includes("pay") || t.includes("invoice") || t.includes("challan") || t.includes("received")) return "payment";
    if (t.includes("delay") || t.includes("cancel") || t.includes("schedule") || t.includes("train")) return "travel";
    return "system";
  };

  // Get matching icon and color coding
  const getIconAndStyle = (title) => {
    const type = getNotificationType(title);
    const t = title?.toLowerCase() || "";
    if (t.includes("cancel") || t.includes("error")) {
      return {
        icon: <FaTimesCircle className="text-red-500 text-2xl" />,
        badgeColor: "bg-red-100 text-red-800",
        badgeText: "Cancelled",
        borderStyle: "border-l-4 border-l-red-500"
      };
    }
    if (t.includes("delay") || t.includes("warning") || t.includes("maintenance")) {
      return {
        icon: <FaExclamationTriangle className="text-yellow-500 text-2xl" />,
        badgeColor: "bg-yellow-100 text-yellow-800",
        badgeText: "Alert",
        borderStyle: "border-l-4 border-l-yellow-500"
      };
    }
    
    switch (type) {
      case "booking":
        return {
          icon: <FaCheckCircle className="text-green-500 text-2xl" />,
          badgeColor: "bg-green-100 text-green-800",
          badgeText: "Booking",
          borderStyle: "border-l-4 border-l-green-500"
        };
      case "payment":
        return {
          icon: <FaCheckCircle className="text-blue-500 text-2xl" />,
          badgeColor: "bg-blue-100 text-blue-800",
          badgeText: "Payment",
          borderStyle: "border-l-4 border-l-blue-500"
        };
      default:
        return {
          icon: <FaInfoCircle className="text-blue-400 text-2xl" />,
          badgeColor: "bg-gray-100 text-gray-800",
          badgeText: "System",
          borderStyle: "border-l-4 border-l-gray-400"
        };
    }
  };

  // Filter & Search matching
  const filteredNotifications = notifications.filter((notif) => {
    const matchesSearch = 
      notif.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      notif.message?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === "all") return matchesSearch;
    return getNotificationType(notif.title) === activeFilter && matchesSearch;
  });

  // Pagination bounds
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredNotifications.slice(indexOfFirstItem, indexOfLastItem);

  const hasUnread = notifications.some((n) => !n.read);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DashboardLayout>
      {/* HEADER SECTION */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-800 flex items-center gap-3">
            Notifications Center
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                {unreadCount} New
              </span>
            )}
          </h1>
          <p className="text-gray-500 mt-2">
            View booking status, delay announcements, payment receipts, and emergency alerts.
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={simulateLiveAlert}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2.5 rounded-xl shadow transition duration-200 text-sm font-semibold cursor-pointer"
            title="Simulate a real-time event alert"
          >
            <FaBolt size={14} className="animate-bounce" />
            Simulate Delay Notice
          </button>

          {hasUnread && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-2 bg-green-900 hover:bg-green-800 text-white px-4 py-2.5 rounded-xl shadow transition duration-200 text-sm font-semibold cursor-pointer"
            >
              <FaCheckDouble size={14} />
              Mark All as Read
            </button>
          )}

          {notifications.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-2 bg-red-650 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl shadow transition duration-200 text-sm font-semibold cursor-pointer"
            >
              <FaTrash size={14} />
              Clear All
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Side: Filter Panels */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border shadow-sm">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Categories</h3>
            <div className="flex flex-col gap-1.5">
              {[
                { id: "all", label: "All Notifications", count: notifications.length },
                { id: "booking", label: "Bookings", count: notifications.filter(n => getNotificationType(n.title) === "booking").length },
                { id: "payment", label: "Payments", count: notifications.filter(n => getNotificationType(n.title) === "payment").length },
                { id: "travel", label: "Travel Delays", count: notifications.filter(n => getNotificationType(n.title) === "travel").length },
                { id: "system", label: "System Notices", count: notifications.filter(n => getNotificationType(n.title) === "system").length }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveFilter(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`flex justify-between items-center px-4 py-2.5 rounded-xl font-bold text-sm transition-all text-left ${
                    activeFilter === tab.id
                      ? "bg-blue-900 text-white shadow"
                      : "hover:bg-gray-50 text-gray-655"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                    activeFilter === tab.id ? "bg-blue-800 text-white" : "bg-gray-100 text-gray-500"
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Search & Notification list */}
        <div className="lg:col-span-3 space-y-4">
          {/* SEARCH BAR */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 pl-12 focus:outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-50 transition shadow-sm"
            />
            <FaSearch className="absolute left-5 top-5 text-gray-400" />
          </div>

          {/* NOTIFICATION CARDS */}
          <div className="space-y-4">
            {currentItems.length === 0 ? (
              <div className="bg-white p-16 rounded-2xl border shadow-sm text-center flex flex-col items-center justify-center text-gray-500">
                <div className="w-16 h-16 bg-blue-50 text-blue-900 rounded-full flex items-center justify-center mb-4">
                  <FaBell className="text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">No Notifications Found</h3>
                <p className="text-sm mt-1 max-w-sm">
                  {searchQuery ? "Try checking spelling or search other keywords." : "You're completely up to date! Live status checks will display here."}
                </p>
              </div>
            ) : (
              currentItems.map((notif) => {
                const { icon, badgeColor, badgeText, borderStyle } = getIconAndStyle(notif.title);
                return (
                  <div
                    key={notif._id}
                    onClick={() => setSelectedNotif(notif)}
                    className={`bg-white p-5 rounded-2xl border shadow-sm hover:shadow-md transition-all flex gap-4 items-start cursor-pointer relative overflow-hidden ${borderStyle} ${
                      !notif.read ? "bg-blue-50/20" : ""
                    }`}
                  >
                    <div className="p-3 bg-gray-50 rounded-xl flex-shrink-0">{icon}</div>

                    <div className="flex-grow space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded ${badgeColor}`}>
                            {badgeText}
                          </span>
                          {!notif.read && (
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
                          )}
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(notif.createdAt).toLocaleDateString()} at{" "}
                          {new Date(notif.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>
                      </div>

                      <h4 className={`text-base text-gray-800 ${!notif.read ? "font-extrabold" : "font-semibold"}`}>
                        {notif.title}
                      </h4>
                      <p className="text-sm text-gray-500 line-clamp-2">{notif.message}</p>
                    </div>

                    {/* Quick Action buttons */}
                    <div className="flex gap-1.5 self-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => toggleRead(notif._id)}
                        className="p-2 text-gray-400 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition"
                        title={notif.read ? "Mark as unread" : "Mark as read"}
                      >
                        {notif.read ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                      </button>
                      <button
                        onClick={() => setNotifToDelete(notif)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete notification"
                      >
                        <FaTrash size={15} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}

            {/* PAGINATION CONTROLS */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl border shadow-sm">
                <span className="text-sm text-gray-500 font-medium">
                  Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredNotifications.length)} of {filteredNotifications.length}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                    className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-all font-bold cursor-pointer"
                  >
                    <FaChevronLeft size={12} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                        currentPage === page
                          ? "bg-blue-900 text-white"
                          : "border hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-all font-bold cursor-pointer"
                  >
                    <FaChevronRight size={12} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DETAIL DIALOG MODAL */}
      {selectedNotif && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-[30000] px-4">
          <div className="bg-white rounded-3xl p-6 border shadow-2xl max-w-lg w-full animate-fadeIn">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${getIconAndStyle(selectedNotif.title).badgeColor}`}>
                  {getIconAndStyle(selectedNotif.title).badgeText}
                </span>
                {!selectedNotif.read && (
                  <span className="text-xs bg-blue-500 text-white font-extrabold px-2 py-0.5 rounded">Unread</span>
                )}
              </div>
              <button
                onClick={() => {
                  if (!selectedNotif.read) toggleRead(selectedNotif._id);
                  setSelectedNotif(null);
                }}
                className="text-gray-400 hover:text-gray-650 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <h3 className="text-xl font-extrabold text-gray-800 mb-2">{selectedNotif.title}</h3>
            <p className="text-xs text-gray-400 font-medium mb-4">
              Received on {new Date(selectedNotif.createdAt).toLocaleDateString()} at{" "}
              {new Date(selectedNotif.createdAt).toLocaleTimeString()}
            </p>

            <div className="bg-gray-50/80 p-4 rounded-2xl border text-sm text-gray-600 leading-relaxed mb-6">
              {selectedNotif.message}
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => toggleRead(selectedNotif._id)}
                className="px-4 py-2 border rounded-xl hover:bg-gray-50 text-gray-600 font-semibold text-sm transition"
              >
                {selectedNotif.read ? "Mark Unread" : "Mark Read"}
              </button>
              <button
                onClick={() => {
                  deleteNotif(selectedNotif._id);
                }}
                className="px-4 py-2 bg-red-650 hover:bg-red-700 text-white font-semibold text-sm rounded-xl transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SINGLE NOTIF DELETE CONFIRMATION */}
      {notifToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-[30000] px-4">
          <div className="bg-white rounded-3xl p-6 border shadow-2xl max-w-sm w-full text-center animate-fadeIn">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaTrash size={20} />
            </div>
            <h4 className="text-lg font-bold text-gray-800">Delete Notification?</h4>
            <p className="text-sm text-gray-500 mt-2">
              Are you sure you want to delete this notification? This action cannot be undone.
            </p>
            <div className="flex gap-3 mt-6 justify-center">
              <button
                onClick={() => setNotifToDelete(null)}
                className="px-4 py-2 border rounded-xl hover:bg-gray-50 text-gray-600 font-semibold text-sm transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteNotif(notifToDelete._id)}
                className="px-4 py-2 bg-red-650 hover:bg-red-700 text-white font-semibold text-sm rounded-xl transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CLEAR ALL BULK CONFIRMATION */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-[30000] px-4">
          <div className="bg-white rounded-3xl p-6 border shadow-2xl max-w-sm w-full text-center animate-fadeIn">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaTrash size={20} />
            </div>
            <h4 className="text-lg font-bold text-gray-800">Clear All Notifications?</h4>
            <p className="text-sm text-gray-500 mt-2">
              Are you sure you want to permanently clear all notifications? This action cannot be reverted.
            </p>
            <div className="flex gap-3 mt-6 justify-center">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 border rounded-xl hover:bg-gray-50 text-gray-600 font-semibold text-sm transition-all"
              >
                Cancel
              </button>
              <button
                onClick={clearAllNotifications}
                className="px-4 py-2 bg-red-650 hover:bg-red-700 text-white font-semibold text-sm rounded-xl transition-all"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Notifications;
