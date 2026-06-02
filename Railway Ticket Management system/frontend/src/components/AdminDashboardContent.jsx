import { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboardContent = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTrains: 0,
    totalBookings: 0,
    verifiedTickets: 0,
    cancelledBookings: 0,
  });

  const fetchStats = async () => {
    try {
      const bookingsRes = await axios.get("http://localhost:5000/api/bookings");
      const usersRes = await axios.get("http://localhost:5000/api/users");
      const trainsRes = await axios.get("http://localhost:5000/api/trains");

      const bookings = bookingsRes.data;
      const verifiedTickets = bookings.filter(
        (booking) => booking.verified === true
      ).length;

      const cancelledBookings = bookings.filter(
        (booking) => booking.status === "cancelled"
      ).length;

      setStats({
        totalUsers: usersRes.data.length,
        totalTrains: trainsRes.data.length,
        totalBookings: bookings.length,
        verifiedTickets,
        cancelledBookings,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <>
      <h1 className="text-4xl font-bold mb-8">
        Admin Dashboard
      </h1>

      {/* STATS CARDS */}
      <div className="grid grid-cols-3 gap-6">
        {/* USERS */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-700">
            Total Users
          </h2>
          <p className="text-5xl font-bold text-blue-900 mt-5">
            {stats.totalUsers}
          </p>
        </div>

        {/* TRAINS */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-700">
            Total Trains
          </h2>
          <p className="text-5xl font-bold text-green-700 mt-5">
            {stats.totalTrains}
          </p>
        </div>

        {/* BOOKINGS */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-700">
            Total Bookings
          </h2>
          <p className="text-5xl font-bold text-red-600 mt-5">
            {stats.totalBookings}
          </p>
        </div>

        {/* VERIFIED TICKETS */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-700">
            Verified Tickets
          </h2>
          <p className="text-5xl font-bold text-green-900 mt-5">
            {stats.verifiedTickets}
          </p>
        </div>

        {/* CANCELLED BOOKINGS */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-700">
            Cancelled Bookings
          </h2>
          <p className="text-5xl font-bold text-yellow-600 mt-5">
            {stats.cancelledBookings}
          </p>
        </div>
      </div>
    </>
  );
};

export default AdminDashboardContent;
