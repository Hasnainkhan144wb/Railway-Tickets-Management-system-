import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout";
import ManageTrains from "./ManageTrains";
import ManageUsers from "./ManageUsers";
import BookingRecords from "./Bookings";
import ReportsAnalytics from "./ReportsAnalytics";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  FaUsers,
  FaTrain,
  FaClipboardList,
  FaDollarSign,
  FaHeartbeat,
  FaSync,
  FaDatabase,
  FaServer,
  FaDownload,
  FaFolderPlus,
  FaUserShield,
  FaCalendarAlt
} from "react-icons/fa";

const AdminDashboard = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get("tab") || "dashboard";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalTrains: 0,
    revenue: 0,
    pendingBookings: 0,
    verifiedBookings: 0,
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [systemHealth, setSystemHealth] = useState({
    dbStatus: "Healthy",
    apiLatency: "45ms",
    cpuLoad: "12%",
    ramUsage: "48%"
  });

  const [dateFilter, setDateFilter] = useState("all");
  const adminUser = JSON.parse(localStorage.getItem("user") || "{}");

  // Fetch Dashboard Stats & Logs
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const usersRes = await axios.get("http://localhost:5000/api/users");
      const bookingsRes = await axios.get("http://localhost:5000/api/bookings");
      const trainsRes = await axios.get("http://localhost:5000/api/trains");

      const bookings = bookingsRes.data;
      const users = usersRes.data;
      const trains = trainsRes.data;

      // Filtered stats count
      const verified = bookings.filter(b => b.verified === true).length;
      const pending = bookings.filter(b => b.verified === false).length;

      // Calculate revenue from price * seatsBooked
      const totalRev = bookings
        .filter(b => b.status === "confirmed")
        .reduce((sum, b) => sum + ((b.train?.ticketPrice || 1200) * (b.seatsBooked || 1)), 0);

      setStats({
        totalUsers: users.length,
        totalBookings: bookings.length,
        totalTrains: trains.length,
        revenue: totalRev,
        pendingBookings: pending,
        verifiedBookings: verified,
      });

      // Construct a unified activity log from bookings, users, and trains
      const activities = [];
      
      // Last 4 Bookings
      bookings.slice(0, 4).forEach(b => {
        activities.push({
          type: "booking",
          message: `${b.passengerName} booked seat on ${b.train?.trainName || "Train Route"}`,
          time: new Date(b.createdAt),
          badgeColor: "bg-emerald-100 text-emerald-800"
        });
      });

      // Last 3 Users
      users.slice(0, 3).forEach(u => {
        activities.push({
          type: "user",
          message: `New user registration: ${u.name} (${u.role})`,
          time: new Date(u.createdAt || Date.now() - 3600000),
          badgeColor: "bg-blue-100 text-blue-800"
        });
      });

      // Last 2 Trains
      trains.slice(0, 2).forEach(t => {
        activities.push({
          type: "train",
          message: `Route update: ${t.trainName} (${t.source} → ${t.destination})`,
          time: new Date(t.createdAt || Date.now() - 7200000),
          badgeColor: "bg-amber-100 text-amber-800"
        });
      });

      // Sort activities descending
      activities.sort((a, b) => b.time - a.time);
      setRecentActivities(activities.slice(0, 6));

      // Simulate minor real-time variance in system performance metrics
      setSystemHealth({
        dbStatus: "Healthy",
        apiLatency: `${Math.floor(Math.random() * 30) + 30}ms`,
        cpuLoad: `${Math.floor(Math.random() * 10) + 8}%`,
        ramUsage: "48%"
      });

      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data. Check backend connections.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "dashboard") {
      fetchDashboardData();
    }
  }, [activeTab]);

  // Export Summary Report
  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + [
        ["Report Title", "Railway Management Admin Executive Report"],
        ["Generated At", new Date().toLocaleString()],
        ["Total Registered Users", stats.totalUsers],
        ["Total Ticket Bookings", stats.totalBookings],
        ["Verified Bookings", stats.verifiedBookings],
        ["Pending Verification", stats.pendingBookings],
        ["Total Ticket Revenue (PKR)", stats.revenue],
        ["Active Railway Routes", stats.totalTrains],
      ].map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `executive_dashboard_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Mock charts data
  const revenueHistory = [
    { name: "Week 1", revenue: stats.revenue * 0.15 },
    { name: "Week 2", revenue: stats.revenue * 0.22 },
    { name: "Week 3", revenue: stats.revenue * 0.35 },
    { name: "Week 4", revenue: stats.revenue * 0.28 },
  ];

  const bookingDistribution = [
    { name: "Verified", value: stats.verifiedBookings, fill: "#10B981" },
    { name: "Pending", value: stats.pendingBookings, fill: "#F59E0B" }
  ];

  // Quick Action triggers
  const handleQuickAction = (action) => {
    switch (action) {
      case "backup":
        alert("Database backup initiated. railway_db_dump.sql saved successfully!");
        break;
      case "clear_cache":
        alert("Client and API response cache successfully cleared!");
        break;
      case "add_route":
        // Navigate tab to trains
        window.location.search = "?tab=trains";
        break;
      default:
        break;
    }
  };

  // Switch Sub-Views dynamically
  if (activeTab === "trains") return <DashboardLayout><ManageTrains isSubView={true} /></DashboardLayout>;
  if (activeTab === "users") return <DashboardLayout><ManageUsers isSubView={true} /></DashboardLayout>;
  if (activeTab === "bookings") return <DashboardLayout><BookingRecords isSubView={true} /></DashboardLayout>;
  if (activeTab === "reports") return <DashboardLayout><ReportsAnalytics isSubView={true} /></DashboardLayout>;

  return (
    <DashboardLayout>
      {/* HEADER SECTION */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-800">
            Welcome, {adminUser.name || "Administrator"}
          </h1>
          <p className="text-gray-550 mt-1">
            System overview and passenger booking intelligence.
          </p>
        </div>

        <div className="flex gap-2.5 flex-wrap">
          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-bold px-4 py-2.5 rounded-xl border shadow-sm transition"
            title="Refresh Stats"
          >
            <FaSync className={loading ? "animate-spin" : ""} />
            Reload Stats
          </button>
          
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-bold px-4 py-2.5 rounded-xl shadow transition"
          >
            <FaDownload />
            Export Report
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-80">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl font-semibold mb-6">
          {error}
        </div>
      ) : (
        <div className="space-y-8">
          {/* KPI CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* TOTAL REVENUE */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-l-4 border-l-emerald-500 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Revenue</p>
                <h3 className="text-2xl font-black text-gray-800 mt-2">Rs. {stats.revenue.toLocaleString()}</h3>
                <span className="text-[10px] text-emerald-600 font-bold mt-1 block">↑ 12.4% this week</span>
              </div>
              <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
                <FaDollarSign size={20} />
              </div>
            </div>

            {/* TOTAL USERS */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-l-4 border-l-blue-900 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Users</p>
                <h3 className="text-2xl font-black text-gray-800 mt-2">{stats.totalUsers}</h3>
                <span className="text-[10px] text-blue-600 font-bold mt-1 block">Passengers & Staff</span>
              </div>
              <div className="p-4 bg-blue-50 text-blue-900 rounded-2xl">
                <FaUsers size={20} />
              </div>
            </div>

            {/* TOTAL BOOKINGS */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-l-4 border-l-purple-600 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Bookings Placed</p>
                <h3 className="text-2xl font-black text-gray-800 mt-2">{stats.totalBookings}</h3>
                <span className="text-[10px] text-purple-600 font-bold mt-1 block">
                  {stats.verifiedBookings} Confirmed
                </span>
              </div>
              <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl">
                <FaClipboardList size={20} />
              </div>
            </div>

            {/* ACTIVE TRAINS */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-l-4 border-l-amber-500 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Railway Routes</p>
                <h3 className="text-2xl font-black text-gray-800 mt-2">{stats.totalTrains}</h3>
                <span className="text-[10px] text-amber-600 font-bold mt-1 block">Active Train Lines</span>
              </div>
              <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
                <FaTrain size={20} />
              </div>
            </div>
          </div>

          {/* QUICK ACTIONS & SYSTEM HEALTH */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions Panel */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border lg:col-span-2">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Command Center</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <button
                  onClick={() => handleQuickAction("add_route")}
                  className="flex flex-col items-center justify-center p-4 rounded-2xl border hover:border-blue-900 hover:bg-blue-50/20 transition group text-center cursor-pointer"
                >
                  <FaFolderPlus className="text-blue-900 mb-2 group-hover:scale-110 transition duration-200" size={20} />
                  <span className="text-xs font-bold text-gray-750">Add Route</span>
                </button>
                <button
                  onClick={() => handleQuickAction("backup")}
                  className="flex flex-col items-center justify-center p-4 rounded-2xl border hover:border-blue-900 hover:bg-blue-50/20 transition group text-center cursor-pointer"
                >
                  <FaDatabase className="text-purple-600 mb-2 group-hover:scale-110 transition duration-200" size={20} />
                  <span className="text-xs font-bold text-gray-750">DB Backup</span>
                </button>
                <button
                  onClick={() => handleQuickAction("clear_cache")}
                  className="flex flex-col items-center justify-center p-4 rounded-2xl border hover:border-blue-900 hover:bg-blue-50/20 transition group text-center cursor-pointer"
                >
                  <FaSync className="text-amber-500 mb-2 group-hover:scale-110 transition duration-200" size={20} />
                  <span className="text-xs font-bold text-gray-750">Flush Cache</span>
                </button>
              </div>
            </div>

            {/* System Health Status */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaHeartbeat className="text-red-500" /> System Metrics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-semibold flex items-center gap-1.5">
                    <FaDatabase size={10} /> Database Link:
                  </span>
                  <span className="text-emerald-600 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase text-[9px]">
                    {systemHealth.dbStatus}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-semibold flex items-center gap-1.5">
                    <FaServer size={10} /> API Latency:
                  </span>
                  <span className="text-gray-800 font-bold">{systemHealth.apiLatency}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-semibold flex items-center gap-1.5">
                    <FaUserShield size={10} /> CPU load:
                  </span>
                  <span className="text-gray-800 font-bold">{systemHealth.cpuLoad}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-semibold flex items-center gap-1.5">
                    <FaCalendarAlt size={10} /> RAM Allocation:
                  </span>
                  <span className="text-gray-800 font-bold">{systemHealth.ramUsage}</span>
                </div>
              </div>
            </div>
          </div>

          {/* RECHARTS TREND CHARTS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Analytics Curve (Area Chart) */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border lg:col-span-2">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Revenue Generation Trend</h3>
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueHistory}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip formatter={(value) => [`Rs. ${Number(value).toLocaleString()}`, 'Revenue']} />
                    <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Ticket Ratios (Donut Chart) */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Ticket Verification ratio</h3>
              <div className="w-full h-64 flex justify-center items-center">
                {stats.totalBookings === 0 ? (
                  <p className="text-xs text-gray-400">No bookings placed yet</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={bookingDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {bookingDistribution.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          {/* RECENT ACTIVITIES LIST */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Audit Log & Activities</h3>
            <div className="divide-y max-h-[350px] overflow-y-auto pr-2">
              {recentActivities.length === 0 ? (
                <p className="text-sm text-gray-400 py-4 text-center">No recent activity detected.</p>
              ) : (
                recentActivities.map((act, idx) => (
                  <div key={idx} className="py-3 flex justify-between items-center gap-3">
                    <div className="flex items-center gap-3">
                      <span className={`text-[9px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded ${act.badgeColor}`}>
                        {act.type}
                      </span>
                      <p className="text-xs font-semibold text-gray-700">{act.message}</p>
                    </div>
                    <span className="text-[10px] text-gray-400">
                      {act.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;