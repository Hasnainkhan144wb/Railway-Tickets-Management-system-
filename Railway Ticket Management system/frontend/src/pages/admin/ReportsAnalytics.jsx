import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const ReportsAnalytics = ({ isSubView }) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalTrains: 0,
    totalRevenue: 0,
    activeBookings: 0,
    cancelledBookings: 0,
  });

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rawBookings, setRawBookings] = useState([]);

  // FETCH ANALYTICS
  const fetchAnalytics = async () => {
    try {
      const usersRes = await axios.get("http://localhost:5000/api/users");
      const bookingsRes = await axios.get("http://localhost:5000/api/bookings");
      const trainsRes = await axios.get("http://localhost:5000/api/trains");

      setRawBookings(bookingsRes.data);
      calculateStats(bookingsRes.data, usersRes.data.length, trainsRes.data.length);
    } catch (error) {
      console.log(error);
    }
  };

  const calculateStats = (bookings, usersCount, trainsCount) => {
    let filtered = [...bookings];

    if (startDate) {
      filtered = filtered.filter(b => new Date(b.createdAt) >= new Date(startDate));
    }
    if (endDate) {
      filtered = filtered.filter(b => new Date(b.createdAt) <= new Date(endDate + "T23:59:59"));
    }

    const confirmed = filtered.filter(b => b.status === "confirmed");
    const cancelled = filtered.filter(b => b.status === "cancelled");

    // Dynamic revenue calculation
    const revenue = confirmed.reduce((sum, b) => {
      const price = b.train?.ticketPrice || 1200; // fallback default
      const seats = b.seatsBooked || 1;
      return sum + (price * seats);
    }, 0);

    setStats({
      totalUsers: usersCount,
      totalBookings: filtered.length,
      totalTrains: trainsCount,
      totalRevenue: revenue,
      activeBookings: confirmed.length,
      cancelledBookings: cancelled.length,
    });
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Recalculate stats when date filters change
  useEffect(() => {
    if (rawBookings.length > 0) {
      calculateStats(rawBookings, stats.totalUsers, stats.totalTrains);
    }
  }, [startDate, endDate]);

  // EXPORT REPORT FUNCTIONALITY (CSV Download)
  const exportToCSV = () => {
    const csvRows = [
      ["Metric", "Value"],
      ["Total System Users", stats.totalUsers],
      ["Total Filtered Bookings", stats.totalBookings],
      ["Confirmed Reservations", stats.activeBookings],
      ["Cancelled Reservations", stats.cancelledBookings],
      ["Total Active Train Routes", stats.totalTrains],
      ["Total Net Revenue (PKR)", stats.totalRevenue],
      ["Report Generated At", new Date().toLocaleString()]
    ];

    const csvContent = "data:text/csv;charset=utf-8," 
      + csvRows.map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `railway_analytics_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // BAR CHART DATA
  const barData = [
    { name: "Total Users", count: stats.totalUsers, fill: "#1E3A8A" },
    { name: "Bookings", count: stats.totalBookings, fill: "#10B981" },
    { name: "Active Routes", count: stats.totalTrains, fill: "#F59E0B" },
  ];

  const ratio = stats.totalBookings > 0 
    ? ((stats.activeBookings / stats.totalBookings) * 100).toFixed(2) 
    : "0.00";

  const unverifiedBookings = Math.max(0, stats.totalBookings - stats.activeBookings);

  // PIE CHART DATA
  const pieData = [
    { name: "Verified/Confirmed", value: stats.activeBookings, color: "#10B981" },
    { name: "Unverified/Pending", value: unverifiedBookings, color: "#F59E0B" },
  ];

  const renderContent = () => (
    <>
      {/* HEADER */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Reports & Analytics</h1>
          <p className="text-gray-500 mt-2">View system revenue summaries, booking rates, and active user analytics.</p>
        </div>
        <button
          onClick={exportToCSV}
          className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-5 py-3 rounded-xl shadow transition"
        >
          Export Summary Report (.CSV)
        </button>
      </div>

      {/* DATE RANGE FILTER PICKER */}
      <div className="bg-white p-5 rounded-2xl border mb-8 flex flex-wrap gap-4 items-center shadow-sm">
        <span className="text-sm font-bold text-gray-700">Filter By Date:</span>
        <div className="flex gap-2 items-center">
          <label className="text-xs text-gray-500 font-semibold uppercase">From</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2.5 rounded-xl text-sm focus:outline-none"
          />
        </div>
        <div className="flex gap-2 items-center">
          <label className="text-xs text-gray-500 font-semibold uppercase">To</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2.5 rounded-xl text-sm focus:outline-none"
          />
        </div>
        {(startDate || endDate) && (
          <button
            onClick={() => {
              setStartDate("");
              setEndDate("");
            }}
            className="text-xs text-red-650 hover:underline font-bold"
          >
            Clear Date Filters
          </button>
        )}
      </div>

      {/* STATS TILES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-l-4 border-l-blue-900">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total Users</h2>
          <p className="text-4xl font-extrabold mt-3 text-blue-900">{stats.totalUsers}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-l-4 border-l-emerald-500">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total Bookings</h2>
          <p className="text-4xl font-extrabold mt-3 text-emerald-600">{stats.totalBookings}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-l-4 border-l-amber-500">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total Trains</h2>
          <p className="text-4xl font-extrabold mt-3 text-amber-500">{stats.totalTrains}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-l-4 border-l-purple-600">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Net Revenue</h2>
          <p className="text-4xl font-extrabold mt-3 text-purple-700">Rs. {stats.totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* CHARTS CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* BAR CHART */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h2 className="text-xl font-bold text-gray-800 mb-6">System Statistics</h2>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {barData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PIE CHART */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Reservation Confirmation Ratios</h2>
            <span className="text-sm font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              Ratio: {ratio}%
            </span>
          </div>
          <div className="w-full h-80 flex flex-col items-center">
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={50}
                  paddingAngle={5}
                  label
                >
                  {pieData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );

  if (isSubView) return renderContent();

  return <DashboardLayout>{renderContent()}</DashboardLayout>;
};

export default ReportsAnalytics;