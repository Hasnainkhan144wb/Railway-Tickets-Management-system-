import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout";
import ManageBookings from "./StaffBookings";
import BookingRecords from "./BookingRecords";
import VerifyTickets from "./VerifyTickets";
import ManageSeats from "./ManageSeats";
import ManageTrainStatus from "./ManageTrainStatus";
import SupportRequests from "./SupportRequests";
import {
  FaTrain,
  FaClipboardList,
  FaCheckCircle,
  FaHeadset,
  FaCalendarAlt,
  FaTasks,
  FaClock,
  FaBullhorn,
  FaStar,
  FaUserCircle
} from "react-icons/fa";

const StaffDashboard = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get("tab") || "dashboard";

  const [trains, setTrains] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [ticketsCount, setTicketsCount] = useState(0);
  const [unresolvedTicketsCount, setUnresolvedTicketsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Daily task checklist (TODOs)
  const [tasks, setTasks] = useState([
    { id: 1, text: "Verify pre-departure logs for Express routes", completed: true },
    { id: 2, text: "Resolve pending passenger ticket refund requests", completed: false },
    { id: 3, text: "Update seat allocation overrides for night shift", completed: false },
    { id: 4, text: "Check platform ticket scanner connection status", completed: true },
    { id: 5, text: "Broadcast schedule delay notices to passengers", completed: false },
  ]);

  const toggleTask = (id) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const staffUser = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchStaffData = async () => {
    try {
      setLoading(true);
      const trainsRes = await axios.get("http://localhost:5000/api/trains");
      const bookingsRes = await axios.get("http://localhost:5000/api/bookings");
      const supportsRes = await axios.get("http://localhost:5000/api/supports");

      setTrains(trainsRes.data);
      setBookings(bookingsRes.data);

      const verifiedCount = bookingsRes.data.filter(b => b.verified === true).length;
      const pendingSupports = supportsRes.data.filter(s => s.status === "pending").length;

      setTicketsCount(verifiedCount);
      setUnresolvedTicketsCount(pendingSupports);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "dashboard") {
      fetchStaffData();
    }
  }, [activeTab]);

  // Handle Action redirects to tabs
  const navigateToTab = (tabName) => {
    window.location.search = `?tab=${tabName}`;
  };

  if (activeTab === "bookings") return <DashboardLayout><ManageBookings isSubView={true} /></DashboardLayout>;
  if (activeTab === "records") return <DashboardLayout><BookingRecords isSubView={true} /></DashboardLayout>;
  if (activeTab === "verify") return <DashboardLayout><VerifyTickets isSubView={true} /></DashboardLayout>;
  if (activeTab === "seats") return <DashboardLayout><ManageSeats isSubView={true} /></DashboardLayout>;
  if (activeTab === "status") return <DashboardLayout><ManageTrainStatus isSubView={true} /></DashboardLayout>;
  if (activeTab === "support") return <DashboardLayout><SupportRequests isSubView={true} /></DashboardLayout>;

  return (
    <DashboardLayout>
      {/* WELCOME BANNER */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-900 rounded-3xl">
            <FaUserCircle size={40} />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-gray-800">
              Hello, {staffUser.name || "Operations Officer"}
            </h1>
            <p className="text-gray-550 mt-1 font-medium">
              Railway Station Staff Console — Shift: Morning (08:00 AM - 04:00 PM)
            </p>
          </div>
        </div>

        <div className="bg-white px-4 py-2.5 rounded-2xl border shadow-sm flex items-center gap-2">
          <FaClock className="text-green-900 animate-pulse" />
          <span className="text-xs font-bold text-gray-700">Shift Status: ACTIVE</span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-80">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-900" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* STAT TILES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* TICKETS VERIFIED */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-l-4 border-l-green-900 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tickets Verified</p>
                <h3 className="text-2xl font-black text-gray-850 mt-2">{ticketsCount} Pass{ticketsCount !== 1 ? "es" : ""}</h3>
                <span className="text-[10px] text-green-700 font-bold block mt-1">Boarded on current shift</span>
              </div>
              <div className="p-4 bg-green-50 text-green-900 rounded-2xl">
                <FaCheckCircle size={20} />
              </div>
            </div>

            {/* UNRESOLVED SUPPORT REQUESTS */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-l-4 border-l-amber-500 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Support Requests</p>
                <h3 className="text-2xl font-black text-gray-850 mt-2">{unresolvedTicketsCount} Pending</h3>
                <span className="text-[10px] text-amber-600 font-bold block mt-1">Assigned to customer care</span>
              </div>
              <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
                <FaHeadset size={20} />
              </div>
            </div>

            {/* ACTIVE SCHEDULED RUNS */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-l-4 border-l-blue-900 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Assigned Routes</p>
                <h3 className="text-2xl font-black text-gray-850 mt-2">{trains.length} Trains</h3>
                <span className="text-[10px] text-blue-900 font-bold block mt-1">Daily departures list</span>
              </div>
              <div className="p-4 bg-blue-50 text-blue-900 rounded-2xl">
                <FaTrain size={20} />
              </div>
            </div>
          </div>

          {/* TWO COLUMN CONTENT */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ASSIGNED SCHEDULES */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border lg:col-span-2">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaCalendarAlt className="text-green-900" /> Today's Train Schedule & Assignments
              </h3>
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                {trains.slice(0, 5).map((train) => (
                  <div key={train._id} className="flex justify-between items-center border-b pb-3 hover:bg-gray-50/50 p-2 rounded-xl transition">
                    <div>
                      <h4 className="font-bold text-sm text-gray-850">{train.trainName}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">{train.source} → {train.destination}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-gray-750 block">{train.departureTime}</span>
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded mt-1 inline-block ${
                        train.trainStatus === "On Time" ? "bg-green-100 text-green-700" : "bg-yellow-105 text-yellow-750"
                      }`}>
                        {train.trainStatus || "On Time"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* QUICK COMMAND CENTER */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Daily Operations</h3>
                <p className="text-xs text-gray-400 mb-6 font-medium">Quick links to perform ticket checks, edit train statuses, and manage seating capacity.</p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => navigateToTab("verify")}
                  className="w-full bg-green-900 hover:bg-green-800 text-white font-bold py-3 rounded-xl transition text-xs uppercase cursor-pointer"
                >
                  Verify QR Tickets
                </button>
                <button
                  onClick={() => navigateToTab("status")}
                  className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 rounded-xl transition text-xs uppercase cursor-pointer"
                >
                  Update Train Status
                </button>
                <button
                  onClick={() => navigateToTab("support")}
                  className="w-full bg-white hover:bg-gray-50 text-gray-700 font-bold py-3 rounded-xl border transition text-xs uppercase cursor-pointer"
                >
                  View Support Requests
                </button>
              </div>
            </div>
          </div>

          {/* TASKS CHECKLIST & ANNOUNCEMENTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* TASK LIST (TODOS) */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaTasks className="text-green-900" /> Duties & Checklist
              </h3>
              <div className="space-y-3">
                {tasks.map(task => (
                  <label
                    key={task.id}
                    className="flex items-center gap-3 p-3 rounded-2xl border hover:bg-gray-50/50 cursor-pointer transition text-xs font-semibold"
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="accent-green-900 h-4 w-4 rounded cursor-pointer"
                    />
                    <span className={task.completed ? "line-through text-gray-400" : "text-gray-700"}>
                      {task.text}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* IMPORTANT ANNOUNCEMENTS & ALERTS */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaBullhorn className="text-amber-500 animate-bounce" /> Broadcast Alerts
              </h3>
              <div className="space-y-4">
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl">
                  <span className="text-[10px] font-bold text-red-600 uppercase">Emergency Service Alert</span>
                  <p className="text-xs text-red-700 mt-1 font-semibold">Track maintenance scheduled on Platform 3 from 10:00 PM to 02:00 AM. Expect route deviations.</p>
                </div>
                <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl">
                  <span className="text-[10px] font-bold text-blue-900 uppercase">Policy Broadcast</span>
                  <p className="text-xs text-blue-950 mt-1 font-semibold">Staff must cross-verify passenger CNIC credentials with QR scanner results for high-priority bookings.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default StaffDashboard;