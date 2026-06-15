import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout";
import { FaCheckCircle, FaSearch } from "react-icons/fa";

const VerifyTickets = ({ isSubView }) => {
  const [bookings, setBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // FETCH BOOKINGS
  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/bookings");
      setBookings(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // VERIFY TICKET (Mark as Boarded & Verified)
  const verifyHandler = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/bookings/verify/${id}`);
      alert("Ticket Verified & Passenger marked as Boarded!");
      fetchBookings();
    } catch (error) {
      console.log(error);
      alert("Verification failed.");
    }
  };



  const getFilteredBookings = () => {
    return bookings.filter(b => {
      if (b.status === "cancelled") return false;
      const name = b.passengerName || "";
      const cnic = b.cnic || "";
      const pId = b.paymentId || "";
      const query = searchQuery.toLowerCase();
      return name.toLowerCase().includes(query) || cnic.includes(query) || pId.toLowerCase().includes(query);
    });
  };

  const renderContent = () => {
    const filtered = getFilteredBookings();

    return (
      <>
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800">Verify Passenger Tickets</h1>
          <p className="text-gray-500 mt-2 font-medium">Verify passenger bookings and mark boarding status.</p>
        </div>



        {/* SEARCH FILTER & DATA TABLE */}
        <div className="bg-white shadow-md rounded-3xl p-6 border">
          <div className="flex items-center gap-3 border p-3 rounded-xl mb-6 focus-within:border-green-900 transition">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search passengers by name, CNIC, or payment ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full focus:outline-none text-sm"
            />
          </div>

          <div className="overflow-auto max-h-[400px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-xs font-bold text-gray-600 uppercase">
                  <th className="p-3 sticky top-0 bg-gray-100 z-10">Passenger</th>
                  <th className="p-3 sticky top-0 bg-gray-100 z-10">CNIC</th>
                  <th className="p-3 sticky top-0 bg-gray-100 z-10">Train</th>
                  <th className="p-3 sticky top-0 bg-gray-100 z-10">Route</th>
                  <th className="p-3 sticky top-0 bg-gray-100 z-10">Payment ID</th>
                  <th className="p-3 sticky top-0 bg-gray-100 z-10">Payment</th>
                  <th className="p-3 sticky top-0 bg-gray-100 z-10">Verify Status</th>
                  <th className="p-3 sticky top-0 bg-gray-100 z-10">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((booking) => (
                  <tr key={booking._id} className="border-b hover:bg-gray-50 text-sm">
                    <td className="p-3 font-semibold text-gray-800">{booking.passengerName}</td>
                    <td className="p-3">{booking.cnic}</td>
                    <td className="p-3 font-medium text-green-900">{booking.train?.trainName}</td>
                    <td className="p-3">{booking.train?.source} → {booking.train?.destination}</td>
                    <td className="p-3 font-mono text-xs">{booking.paymentId || "—"}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${booking.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-750"}`}>
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${booking.verified ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {booking.verified ? "Verified" : "Pending"}
                      </span>
                    </td>
                    <td className="p-3">
                      {!booking.verified && booking.paymentStatus === "paid" ? (
                        <button
                          onClick={() => verifyHandler(booking._id)}
                          className="bg-blue-900 hover:bg-blue-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition"
                        >
                          Verify & Board
                        </button>
                      ) : booking.verified ? (
                        <span className="text-blue-900 font-bold text-xs uppercase flex items-center gap-1">
                          <FaCheckCircle /> Boarded
                        </span>
                      ) : (
                        <span className="text-red-500 text-xs font-semibold">Unpaid Ticket</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };

  if (isSubView) return renderContent();

  return <DashboardLayout>{renderContent()}</DashboardLayout>;
};

export default VerifyTickets;