import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaBell, FaCamera, FaTimes, FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import axios from "axios";

const Topbar = () => {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Edit profile form state
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar: "",
  });
  const [profileLoading, setProfileLoading] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (storedUser) {
      setUser(storedUser);
      setProfileForm({
        name: storedUser.name || "",
        email: storedUser.email || "",
        password: "",
        confirmPassword: "",
        avatar: storedUser.avatar || "",
      });
    }
  }, []);

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
    if (user) {
      fetchUnreadCount();
      if (user.role === "passenger") {
        fetchNotifications();
      }
    }
  }, [user]);

  useEffect(() => {
    if (!user || user.role !== "passenger") return;
    const interval = setInterval(() => {
      fetchUnreadCount();
      if (isOpen) {
        fetchNotifications();
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [isOpen, user]);

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

  // Convert uploaded image to Base64
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileForm(prev => ({
        ...prev,
        avatar: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  // Handle Profile Update Submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    if (profileForm.password && profileForm.password !== profileForm.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      setProfileLoading(true);
      const userId = user.id || user._id;
      const res = await axios.put(`http://localhost:5000/api/auth/profile/${userId}`, {
        name: profileForm.name,
        email: profileForm.email,
        avatar: profileForm.avatar,
        password: profileForm.password || undefined
      });

      if (res.data.success) {
        alert("Profile Updated Successfully!");
        // Update user state and localStorage
        const updatedUser = res.data.user;
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsProfileOpen(false);
        // Minor reload after a short delay to propagate changes to dashboard greetings
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    } catch (err) {
      console.log("Error updating profile:", err);
      alert(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <div className="bg-white shadow p-4 flex justify-between items-center relative border-b border-gray-150">
      <h2 className="text-2xl font-black text-gray-800">Dashboard</h2>

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

        {/* CLICKABLE USER AVATAR & NAME */}
        <div
          onClick={() => setIsProfileOpen(true)}
          className="flex items-center gap-3 cursor-pointer hover:opacity-90 group transition duration-200"
          title="Edit Profile"
        >
          <div className="text-right hidden sm:block">
            <p className="font-bold text-gray-800 group-hover:text-green-900 transition text-sm">
              {user?.name}
            </p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-extrabold">
              {user?.role}
            </p>
          </div>
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-green-900 shadow-sm group-hover:scale-105 transition duration-200"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-green-900 text-white flex items-center justify-center font-black text-sm border-2 border-green-700 shadow-sm group-hover:scale-105 transition duration-200 uppercase">
              {user?.name ? user.name.charAt(0) : "U"}
            </div>
          )}
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {isProfileOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-gray-100 relative flex flex-col max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
              <h3 className="text-lg font-extrabold text-gray-800">Edit Profile</h3>
              <button
                onClick={() => setIsProfileOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <FaTimes size={18} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleProfileSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* Avatar upload */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative group cursor-pointer">
                  {profileForm.avatar ? (
                    <img
                      src={profileForm.avatar}
                      alt="Avatar Preview"
                      className="w-24 h-24 rounded-full object-cover border-4 border-green-900 shadow"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-green-900 text-white flex items-center justify-center text-3xl font-black border-4 border-green-700 shadow uppercase">
                      {profileForm.name ? profileForm.name.charAt(0) : "U"}
                    </div>
                  )}
                  <label className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition duration-200 cursor-pointer">
                    <FaCamera size={20} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <span className="text-[10px] text-gray-400 font-bold uppercase">Click photo to update DP</span>
              </div>

              {/* Name field */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                <div className="flex items-center border rounded-xl px-3 py-2 bg-gray-50/50 focus-within:border-green-900 transition">
                  <FaUser className="text-gray-450 mr-2" size={14} />
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-transparent focus:outline-none text-sm text-gray-700"
                  />
                </div>
              </div>

              {/* Email field */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                <div className="flex items-center border rounded-xl px-3 py-2 bg-gray-50/50 focus-within:border-green-900 transition">
                  <FaEnvelope className="text-gray-450 mr-2" size={14} />
                  <input
                    type="email"
                    required
                    value={profileForm.email}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-transparent focus:outline-none text-sm text-gray-700"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  New Password <span className="text-gray-400 font-medium">(Leave blank to keep current)</span>
                </label>
                <div className="flex items-center border rounded-xl px-3 py-2 bg-gray-50/50 focus-within:border-green-900 transition">
                  <FaLock className="text-gray-450 mr-2" size={14} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    value={profileForm.password}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full bg-transparent focus:outline-none text-sm text-gray-700"
                  />
                </div>
              </div>

              {/* Confirm Password field */}
              {profileForm.password && (
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Confirm New Password</label>
                  <div className="flex items-center border rounded-xl px-3 py-2 bg-gray-50/50 focus-within:border-green-900 transition">
                    <FaLock className="text-gray-450 mr-2" size={14} />
                    <input
                      type="password"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      required={!!profileForm.password}
                      value={profileForm.confirmPassword}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full bg-transparent focus:outline-none text-sm text-gray-700"
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="bg-green-900 hover:bg-green-800 text-white font-bold py-3 px-4 rounded-xl flex-1 transition text-sm cursor-pointer disabled:opacity-50"
                >
                  {profileLoading ? "Updating Profile..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(false)}
                  className="bg-gray-100 hover:bg-gray-250 text-gray-700 font-bold py-3 px-4 rounded-xl flex-grow-0 border transition text-sm cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Topbar;