import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaTicketAlt, FaTrain, FaBell, FaClock, FaTimes } from "react-icons/fa";

const PassengerDashboardContent = () => {
  const [bookings, setBookings] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [stats, setStats] = useState({ totalBookings: 0, upcomingTrips: 0 });
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const fetchStats = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/bookings/user/${user.id}/stats`
      );
      setStats({
        totalBookings: res.data.totalBookings ?? 0,
        upcomingTrips: res.data.upcomingTrips ?? 0,
      });
    } catch (error) {
      console.log(error);
      setStats({ totalBookings: 0, upcomingTrips: 0 });
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/bookings/user/${user.id}`
      );
      setBookings(res.data);
      fetchStats();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/api/notifications/unread-count",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUnreadCount(res.data.count);
    } catch (error) {
      console.log(error);
    }
  };

  const makePayment = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/bookings/payment/${id}`);
      alert("Payment Completed Successfully");
      fetchBookings();
      fetchStats();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchUnreadCount();
    fetchStats();
  }, []);

  const pendingPaymentsBookings = bookings.filter(
    (booking) => booking.paymentStatus === "pending"
  );
  
  const pendingPaymentsCount = pendingPaymentsBookings.length;
  const latestPendingBooking = pendingPaymentsBookings[0] || null;

  const recentBookings = bookings.slice(0, 5);

  return (
    <>
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Passenger Dashboard
        </h1>
        <p className="text-gray-500 mt-2">
          Welcome back, {user?.name}
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* TOTAL BOOKINGS */}
        <div className="bg-white shadow-md rounded-xl p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Bookings</p>
              <h2 className="text-3xl font-bold mt-2">{stats.totalBookings}</h2>
            </div>
            <FaTicketAlt className="text-4xl text-blue-500" />
          </div>
        </div>

        {/* UPCOMING TRIPS */}
        <div className="bg-white shadow-md rounded-xl p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Upcoming Trips</p>
              <h2 className="text-3xl font-bold mt-2">{stats.upcomingTrips}</h2>
            </div>
            <FaTrain className="text-4xl text-green-500" />
          </div>
        </div>

        {/* NOTIFICATIONS */}
        <div
          onClick={() => navigate("/notifications")}
          className="bg-white shadow-md rounded-xl p-6 border cursor-pointer hover:shadow-lg transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Notifications</p>
              <h2 className="text-3xl font-bold mt-2">{unreadCount}</h2>
            </div>
            <div className="relative">
              <FaBell className="text-4xl text-purple-500" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold">
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
              alert("No Pending Payments Found");
            }
          }}
          className="bg-white shadow-md rounded-xl p-6 border cursor-pointer hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 font-medium">Pending Payments</p>
              <h2 className="text-3xl font-bold mt-2 text-red-600">{pendingPaymentsCount}</h2>
            </div>
            <FaClock className="text-4xl text-red-500" />
          </div>
          {latestPendingBooking && (
            <div className="mt-4 pt-3 border-t border-dashed border-gray-150 text-xs w-full">
              <span className="text-gray-400 block uppercase tracking-wider font-semibold">Latest Pending:</span>
              <p className="font-semibold text-gray-800 mt-1 truncate">
                {latestPendingBooking.train?.trainName}
              </p>
              <p className="text-gray-500 mt-0.5">
                Rs. {latestPendingBooking.train?.ticketPrice * latestPendingBooking.seatsBooked}
              </p>
              <span className="text-blue-600 font-semibold hover:underline block mt-1">
                (Click to Pay Details)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* RECENT BOOKINGS */}
      <div className="bg-white shadow-md rounded-xl p-6 border">
        <h2 className="text-2xl font-bold mb-6">Recent Bookings</h2>
        <div className="overflow-auto max-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 sticky top-0 bg-gray-100 z-10">Train</th>
                <th className="p-3 sticky top-0 bg-gray-100 z-10">From</th>
                <th className="p-3 sticky top-0 bg-gray-100 z-10">To</th>
                <th className="p-3 sticky top-0 bg-gray-100 z-10">Date</th>
                <th className="p-3 sticky top-0 bg-gray-100 z-10">Payment</th>
                <th className="p-3 sticky top-0 bg-gray-100 z-10">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => (
                <tr key={booking._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{booking.train?.trainName}</td>
                  <td className="p-3">{booking.train?.source}</td>
                  <td className="p-3">{booking.train?.destination}</td>
                  <td className="p-3">{booking.train?.departureTime}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        booking.paymentStatus === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {booking.paymentStatus}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        booking.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PENDING PAYMENTS MODAL */}
      {showPendingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-6">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto relative border border-gray-100">
            <button
              onClick={() => setShowPendingModal(false)}
              className="absolute top-5 right-5 bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-all hover:scale-110 duration-200 cursor-pointer z-50 flex items-center justify-center"
              title="Close"
            >
              <FaTimes size={18} />
            </button>

            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Pending Payments
              </h2>

              <div className="space-y-4">
                {pendingPaymentsBookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="border border-gray-200 rounded-2xl p-5 hover:shadow-md transition duration-200 bg-white"
                  >
                    <div className="grid grid-cols-2 gap-4 text-left">
                      <div>
                        <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">
                          Train
                        </span>
                        <span className="text-sm font-bold text-gray-800">
                          {booking.train?.trainName}
                        </span>
                      </div>

                      <div>
                        <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">
                          Route
                        </span>
                        <span className="text-sm font-semibold text-gray-800">
                          {booking.train?.source} → {booking.train?.destination}
                        </span>
                      </div>

                      <div>
                        <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">
                          Payment ID
                        </span>
                        <span className="text-sm font-mono font-bold text-blue-700">
                          {booking.paymentId}
                        </span>
                      </div>

                      <div>
                        <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">
                          Amount
                        </span>
                        <span className="text-sm font-bold text-green-700">
                          Rs. {booking.train?.ticketPrice * booking.seatsBooked}
                        </span>
                      </div>

                      <div className="col-span-2">
                        <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">
                          Passenger
                        </span>
                        <span className="text-sm font-semibold text-gray-800">
                          {booking.passengerName}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center">
                      <span className="text-sm font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full">
                        Status: Pending
                      </span>
                      <button
                        onClick={async () => {
                          await makePayment(booking._id);
                          const remaining = pendingPaymentsBookings.filter(b => b._id !== booking._id).length;
                          if (remaining === 0) {
                            setShowPendingModal(false);
                          }
                        }}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-5 py-2.5 rounded-xl transition duration-200 shadow cursor-pointer"
                      >
                        Pay Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PassengerDashboardContent;
