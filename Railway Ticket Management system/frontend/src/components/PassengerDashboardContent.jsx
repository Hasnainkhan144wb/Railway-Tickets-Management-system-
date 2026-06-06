import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaTicketAlt,
  FaTrain,
  FaBell,
  FaClock,
  FaTimes,
  FaUser,
  FaSearch,
  FaHeadset,
  FaArrowRight,
  FaSync,
  FaShieldAlt,
  FaRegCalendarAlt,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const PassengerDashboardContent = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [stats, setStats] = useState({ 
    totalBookings: 0, 
    upcomingTrips: 0,
    spentAmount: 0 
  });

  const [searchQuery, setSearchQuery] = useState({
    source: "",
    destination: "",
  });

  const fetchStats = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/bookings/user/${user.id}/stats`
      );
      // Fallback calculation in case endpoint doesn't return full details
      const userBookings = bookings.length > 0 ? bookings : [];
      const totalAmount = userBookings
        .filter(b => b.paymentStatus === "paid")
        .reduce((sum, b) => sum + ((b.train?.ticketPrice || 0) * (b.seatsBooked || 1)), 0);

      setStats({
        totalBookings: res.data.totalBookings ?? userBookings.length,
        upcomingTrips: res.data.upcomingTrips ?? userBookings.filter(b => b.status === "confirmed").length,
        spentAmount: totalAmount,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/bookings/user/${user.id}`
      );
      setBookings(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const resUnread = await axios.get(
        "http://localhost:5000/api/notifications/unread-count",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUnreadCount(resUnread.data.count);

      // Fetch latest notifications for preview list
      const resAll = await axios.get(
        "http://localhost:5000/api/notifications",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(resAll.data.slice(0, 3)); // show top 3
    } catch (error) {
      console.log(error);
    }
  };

  const makePayment = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/bookings/payment/${id}`);
      alert("Payment Completed Successfully");
      await handleRefresh();
    } catch (error) {
      console.log(error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");
      if (token && userStr) {
        await fetchBookings();
        await fetchNotifications();
        await fetchStats();
      }
    } catch (error) {
      console.error("Failed to refresh dashboard data", error);
    } finally {
      // Small timeout for better user feedback
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  // Sync stats when bookings change
  useEffect(() => {
    if (bookings.length > 0) {
      fetchStats();
    }
  }, [bookings]);

  const pendingPaymentsBookings = bookings.filter(
    (booking) => booking.paymentStatus === "pending"
  );
  
  const pendingPaymentsCount = pendingPaymentsBookings.length;
  const latestPendingBooking = pendingPaymentsBookings[0] || null;

  // Filter confirmed upcoming bookings
  const upcomingBookings = bookings
    .filter((booking) => booking.status === "confirmed")
    .slice(0, 3);

  const recentBookings = bookings.slice(0, 5);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Redirect to Book Ticket page and pass search query via state
    navigate("/book-ticket", {
      state: {
        source: searchQuery.source,
        destination: searchQuery.destination,
      },
    });
  };

  return (
    <div className={`space-y-6 transition-colors duration-300 ${darkMode ? "text-white" : "text-gray-800"}`}>
      
      {/* WELCOME BANNER */}
      <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
        darkMode 
          ? "bg-gradient-to-r from-gray-900 via-green-950 to-gray-900 border-gray-800" 
          : "bg-gradient-to-r from-green-900 via-green-800 to-emerald-900 text-white border-green-950"
      }`}>
        <div className="space-y-1 z-10">
          <span className="text-xs uppercase font-bold tracking-widest text-yellow-400">
            Passenger Portal
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back, {user?.name}!
          </h1>
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-green-100"}`}>
            Plan your next journey, manage tickets, or access quick support.
          </p>
        </div>
        
        {/* REFRESH BUTTON */}
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer select-none ${
            darkMode 
              ? "bg-gray-800/60 hover:bg-gray-800 border-gray-700 text-gray-300" 
              : "bg-white/10 hover:bg-white/20 border-white/20 text-white"
          }`}
        >
          <FaSync className={`text-sm ${isRefreshing ? "animate-spin" : ""}`} />
          <span>{isRefreshing ? "Refreshing..." : "Refresh Status"}</span>
        </button>

        {/* Decorative backdrop shapes */}
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      </div>

      {/* STATS CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* TOTAL BOOKINGS */}
        <div className={`shadow-md rounded-2xl p-6 border transition-all hover:scale-[1.02] ${
          darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Bookings</p>
              <h2 className="text-3xl font-extrabold mt-1">{stats.totalBookings}</h2>
            </div>
            <div className="p-3.5 bg-blue-500/10 rounded-xl">
              <FaTicketAlt className="text-2xl text-blue-500" />
            </div>
          </div>
        </div>

        {/* UPCOMING TRIPS */}
        <div className={`shadow-md rounded-2xl p-6 border transition-all hover:scale-[1.02] ${
          darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Upcoming Trips</p>
              <h2 className="text-3xl font-extrabold mt-1 text-green-600 dark:text-green-400">{stats.upcomingTrips}</h2>
            </div>
            <div className="p-3.5 bg-green-500/10 rounded-xl">
              <FaTrain className="text-2xl text-green-500" />
            </div>
          </div>
        </div>

        {/* NOTIFICATIONS */}
        <div
          onClick={() => navigate("/notifications")}
          className={`shadow-md rounded-2xl p-6 border cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg ${
            darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Notifications</p>
              <h2 className="text-3xl font-extrabold mt-1 text-purple-600 dark:text-purple-400">{unreadCount}</h2>
            </div>
            <div className="relative p-3.5 bg-purple-500/10 rounded-xl">
              <FaBell className="text-2xl text-purple-500" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 bg-red-500 text-white rounded-full text-[10px] w-5 h-5 flex items-center justify-center font-black animate-pulse">
                  {unreadCount}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* PENDING PAYMENTS */}
        <div
          onClick={() => {
            if (pendingPaymentsCount > 0) {
              setShowPendingModal(true);
            } else {
              alert("No pending payments found. All clear!");
            }
          }}
          className={`shadow-md rounded-2xl p-6 border cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg flex flex-col justify-between ${
            darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Pending Payments</p>
              <h2 className="text-3xl font-extrabold mt-1 text-red-500">{pendingPaymentsCount}</h2>
            </div>
            <div className="p-3.5 bg-red-500/10 rounded-xl">
              <FaClock className="text-2xl text-red-500" />
            </div>
          </div>
          {latestPendingBooking && (
            <div className="mt-3 pt-2.5 border-t border-dashed border-gray-200 dark:border-gray-800 text-[11px] w-full flex justify-between items-center">
              <span className="text-red-500 font-bold truncate max-w-[100px]">{latestPendingBooking.train?.trainName}</span>
              <span className="text-blue-500 font-bold hover:underline select-none">Pay now →</span>
            </div>
          )}
        </div>
      </div>

      {/* QUICK TRAIN SEARCH PANEL */}
      <div className={`p-6 rounded-2xl shadow-md border ${
        darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
      }`}>
        <div className="flex items-center gap-2 mb-4">
          <FaSearch className="text-yellow-500 text-lg" />
          <h3 className="text-lg font-bold">Quick Train Search</h3>
        </div>
        
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="From Station (e.g. Lahore)"
            value={searchQuery.source}
            onChange={(e) => setSearchQuery(prev => ({ ...prev, source: e.target.value }))}
            className={`border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
              darkMode ? "bg-gray-850 border-gray-700 text-white placeholder-gray-500" : "bg-gray-50 border-gray-300 text-gray-800"
            }`}
          />
          <input
            type="text"
            placeholder="To Station (e.g. Karachi)"
            value={searchQuery.destination}
            onChange={(e) => setSearchQuery(prev => ({ ...prev, destination: e.target.value }))}
            className={`border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
              darkMode ? "bg-gray-850 border-gray-700 text-white placeholder-gray-500" : "bg-gray-50 border-gray-300 text-gray-800"
            }`}
          />
          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-600 text-green-950 font-bold rounded-xl text-sm py-3 transition-colors flex items-center justify-center gap-2 shadow cursor-pointer"
          >
            <span>Find Trains</span>
            <FaArrowRight className="text-xs" />
          </button>
        </form>
      </div>

      {/* TWO COLUMN MAIN CONTENT DASHBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT TWO COLUMNS: TRIPS & HISTORY */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* UPCOMING TRIPS TIMELINE */}
          <div className={`p-6 rounded-2xl shadow-md border ${
            darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
          }`}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FaRegCalendarAlt className="text-green-500" />
              <span>Upcoming Journeys</span>
            </h3>
            
            {upcomingBookings.length === 0 ? (
              <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400 space-y-2">
                <FaTrain className="text-4xl text-gray-300 mx-auto" />
                <p>No upcoming journeys found.</p>
                <button 
                  onClick={() => navigate("/book-ticket")}
                  className="text-xs text-yellow-500 hover:underline font-bold"
                >
                  Book your first ticket today
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingBookings.map((trip) => (
                  <div 
                    key={trip._id} 
                    className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      darkMode ? "bg-gray-800/40 border-gray-700/60" : "bg-gray-50 border-gray-250"
                    }`}
                  >
                    <div className="space-y-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-blue-600 dark:text-blue-400">
                          {trip.train?.trainName}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold select-none capitalize ${
                          trip.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {trip.paymentStatus}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-gray-800 dark:text-white">
                        {trip.train?.source} &rarr; {trip.train?.destination}
                      </p>
                      <p className="text-xs text-gray-400 font-medium">
                        Departure: {trip.train?.departureTime}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="text-right text-xs">
                        <span className="text-gray-400 block font-medium">Seats Selected</span>
                        <span className="font-bold text-gray-800 dark:text-white">
                          {trip.seatsBooked} Seat{trip.seatsBooked > 1 ? "s" : ""}
                        </span>
                      </div>
                      <button
                        onClick={() => navigate("/my-bookings")}
                        className="bg-green-900 hover:bg-green-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition duration-200 cursor-pointer shadow"
                      >
                        View Ticket
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RECENT BOOKINGS */}
          <div className={`p-6 rounded-2xl shadow-md border ${
            darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Recent Bookings</h3>
              <button 
                onClick={() => navigate("/my-bookings")}
                className="text-xs text-yellow-500 font-bold hover:underline"
              >
                View All
              </button>
            </div>
            
            {recentBookings.length === 0 ? (
              <p className="text-center py-6 text-sm text-gray-500">No booking records found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      <th className="py-3 font-semibold text-gray-400">Train</th>
                      <th className="py-3 font-semibold text-gray-400">Route</th>
                      <th className="py-3 font-semibold text-gray-400">Date/Time</th>
                      <th className="py-3 font-semibold text-gray-400 text-center">Payment</th>
                      <th className="py-3 font-semibold text-gray-400 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking) => (
                      <tr key={booking._id} className="border-b border-gray-100 dark:border-gray-850 hover:bg-gray-50 dark:hover:bg-gray-800/30">
                        <td className="py-3.5 font-bold text-gray-800 dark:text-white">
                          {booking.train?.trainName}
                        </td>
                        <td className="py-3.5">
                          {booking.train?.source} &rarr; {booking.train?.destination}
                        </td>
                        <td className="py-3.5 text-xs text-gray-400">
                          {booking.train?.departureTime}
                        </td>
                        <td className="py-3.5 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize ${
                            booking.paymentStatus === "paid"
                              ? "bg-green-500/10 text-green-600 dark:text-green-400"
                              : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                          }`}>
                            {booking.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3.5 text-right font-bold capitalize">
                          <span className={booking.status === "confirmed" ? "text-green-600" : "text-red-500"}>
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: ACCOUNT & QUICK ACTIONS */}
        <div className="space-y-6">
          
          {/* PROFILE SUMMARY CARD */}
          <div className={`p-6 rounded-2xl shadow-md border overflow-hidden relative ${
            darkMode 
              ? "bg-gradient-to-br from-gray-900 to-gray-850 border-gray-800" 
              : "bg-gradient-to-br from-white to-gray-50 border-gray-200"
          }`}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FaUser className="text-yellow-500" />
              <span>Membership Info</span>
            </h3>
            
            {/* Visual Member Card */}
            <div className={`p-5 rounded-xl text-white relative shadow-lg overflow-hidden ${
              darkMode ? "bg-gradient-to-br from-emerald-950 to-green-900" : "bg-gradient-to-br from-green-900 to-green-800"
            }`}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-300">Railway Privilege</span>
                  <p className="text-lg font-bold truncate max-w-[150px]">{user?.name}</p>
                </div>
                <FaShieldAlt className="text-yellow-400 text-2xl" />
              </div>
              
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-[9px] text-green-200 block">ID: {user?.id?.substring(0, 8).toUpperCase() || "N/A"}</span>
                  <span className="text-xs uppercase font-bold text-yellow-300">Verified Passenger</span>
                </div>
                <div className="text-right text-[10px] text-green-200">
                  Since {new Date().getFullYear()}
                </div>
              </div>
              
              {/* Card Holographic Glow Overlay */}
              <div className="absolute right-0 top-0 w-24 h-24 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
            </div>

            {/* Email list detail */}
            <div className="mt-4 pt-3 border-t border-gray-150 dark:border-gray-800 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Email Address:</span>
                <span className="font-bold">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Account Status:</span>
                <span className="text-green-600 dark:text-green-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* QUICK ACTION TILES */}
          <div className={`p-6 rounded-2xl shadow-md border ${
            darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
          }`}>
            <h3 className="text-lg font-bold mb-4">Quick Navigation</h3>
            <div className="grid grid-cols-2 gap-3.5">
              
              <button
                onClick={() => navigate("/book-ticket")}
                className={`p-3.5 rounded-xl border flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-all hover:scale-105 ${
                  darkMode ? "bg-gray-800/40 border-gray-700 hover:bg-gray-850" : "bg-gray-50 border-gray-200 hover:bg-blue-50/40 hover:border-blue-200"
                }`}
              >
                <FaTicketAlt className="text-xl text-blue-500" />
                <span className="text-[11px] font-bold">Book Ticket</span>
              </button>

              <button
                onClick={() => navigate("/my-bookings")}
                className={`p-3.5 rounded-xl border flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-all hover:scale-105 ${
                  darkMode ? "bg-gray-800/40 border-gray-700 hover:bg-gray-850" : "bg-gray-50 border-gray-200 hover:bg-green-50/40 hover:border-green-200"
                }`}
              >
                <FaTrain className="text-xl text-green-500" />
                <span className="text-[11px] font-bold">My Bookings</span>
              </button>

              <button
                onClick={() => navigate("/notifications")}
                className={`p-3.5 rounded-xl border flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-all hover:scale-105 ${
                  darkMode ? "bg-gray-800/40 border-gray-700 hover:bg-gray-850" : "bg-gray-50 border-gray-200 hover:bg-purple-50/40 hover:border-purple-200"
                }`}
              >
                <div className="relative">
                  <FaBell className="text-xl text-purple-500" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[8px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-bold">Alerts</span>
              </button>

              <button
                onClick={() => navigate("/support")}
                className={`p-3.5 rounded-xl border flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-all hover:scale-105 ${
                  darkMode ? "bg-gray-800/40 border-gray-700 hover:bg-gray-850" : "bg-gray-50 border-gray-200 hover:bg-yellow-50/30 hover:border-yellow-200"
                }`}
              >
                <FaHeadset className="text-xl text-yellow-500" />
                <span className="text-[11px] font-bold">Get Support</span>
              </button>

            </div>
          </div>

          {/* LATEST NOTIFICATIONS QUICK PREVIEW */}
          <div className={`p-6 rounded-2xl shadow-md border ${
            darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
          }`}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FaBell className="text-purple-500" />
              <span>Latest Bulletins</span>
            </h3>
            
            {notifications.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-4">No recent notifications.</p>
            ) : (
              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div 
                    key={notif._id} 
                    className={`p-3 rounded-xl border text-left text-xs space-y-1 ${
                      darkMode 
                        ? notif.read ? "bg-gray-850/50 border-gray-800/80 text-gray-400" : "bg-purple-950/20 border-purple-900/40 text-gray-200" 
                        : notif.read ? "bg-gray-50 border-gray-150 text-gray-500" : "bg-purple-50/60 border-purple-100 text-purple-950"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[10px] uppercase text-purple-600 dark:text-purple-400">
                        {notif.type || "Notification"}
                      </span>
                      <span className="text-[9px] text-gray-400">
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="leading-tight">{notif.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* PENDING PAYMENTS MODAL */}
      {showPendingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-6">
          <div className={`rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto relative border ${
            darkMode ? "bg-gray-900 border-gray-800 text-white" : "bg-white border-gray-100 text-gray-800"
          }`}>
            <button
              onClick={() => setShowPendingModal(false)}
              className="absolute top-5 right-5 bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-all hover:scale-110 duration-200 cursor-pointer z-50 flex items-center justify-center"
              title="Close"
            >
              <FaTimes size={18} />
            </button>

            <div className="p-8 text-left">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FaClock className="text-red-500" />
                <span>Pending Challan Payments</span>
              </h2>

              <div className="space-y-4">
                {pendingPaymentsBookings.map((booking) => (
                  <div
                    key={booking._id}
                    className={`border rounded-2xl p-5 hover:shadow-md transition duration-200 ${
                      darkMode ? "bg-gray-800/40 border-gray-700" : "bg-white border-gray-200"
                    }`}
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                          Train
                        </span>
                        <span className="text-sm font-bold">
                          {booking.train?.trainName}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                          Route
                        </span>
                        <span className="text-sm font-semibold">
                          {booking.train?.source} → {booking.train?.destination}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                          Payment Challan ID
                        </span>
                        <span className="text-sm font-mono font-bold text-blue-500">
                          {booking.paymentId}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                          Amount Due
                        </span>
                        <span className="text-sm font-bold text-green-600">
                          Rs. {booking.train?.ticketPrice * booking.seatsBooked}
                        </span>
                      </div>

                      <div className="col-span-2">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                          Passenger
                        </span>
                        <span className="text-sm font-semibold">
                          {booking.passengerName}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                      <span className="text-xs font-semibold text-red-600 bg-red-500/10 px-3 py-1 rounded-full">
                        Status: Pending Verification
                      </span>
                      <button
                        onClick={async () => {
                          await makePayment(booking._id);
                          const remaining = pendingPaymentsBookings.filter(b => b._id !== booking._id).length;
                          if (remaining === 0) {
                            setShowPendingModal(false);
                          }
                        }}
                        className="bg-yellow-500 hover:bg-yellow-600 text-green-950 font-bold px-5 py-2.5 rounded-xl transition duration-200 shadow cursor-pointer text-xs"
                      >
                        Simulate Payment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PassengerDashboardContent;
