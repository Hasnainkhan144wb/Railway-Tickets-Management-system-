import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout";

const ManageBookings = ({ isSubView }) => {
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

  // DELETE BOOKING
  const deleteBooking = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this booking?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/bookings/${id}`);
      alert("Booking Deleted Successfully");
      fetchBookings();
    } catch (error) {
      console.log(error);
    }
  };

  const getFilteredBookings = () => {
    return bookings.filter((b) => {
      const passengerName = b.passengerName || "";
      const cnic = b.cnic || "";
      const trainName = b.train?.trainName || "";
      return (
        passengerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cnic.includes(searchQuery) ||
        trainName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  };

  const renderContent = () => {
    const filtered = getFilteredBookings();
    return (
      <>
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Manage Bookings</h1>
          <p className="text-gray-500 mt-2">View and manage passenger booking records.</p>
        </div>

        {/* SEARCH BAR */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by passenger name, CNIC, or train..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-3 rounded-xl w-full focus:outline-none focus:border-green-900 transition text-sm"
          />
        </div>

        {/* TABLE */}
        <div className="bg-white shadow-md rounded-xl p-6 border">
          <div className="overflow-auto max-h-[500px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 sticky top-0 bg-gray-100 z-10">Passenger</th>
                  <th className="p-3 sticky top-0 bg-gray-100 z-10">CNIC</th>
                  <th className="p-3 sticky top-0 bg-gray-100 z-10">Train</th>
                  <th className="p-3 sticky top-0 bg-gray-100 z-10">Route</th>
                  <th className="p-3 sticky top-0 bg-gray-100 z-10">Coach</th>
                  <th className="p-3 sticky top-0 bg-gray-100 z-10">Seats</th>
                  <th className="p-3 sticky top-0 bg-gray-100 z-10">Status</th>
                  <th className="p-3 sticky top-0 bg-gray-100 z-10">Booking Date</th>
                  <th className="p-3 sticky top-0 bg-gray-100 z-10">Cancel Date</th>
                  <th className="p-3 sticky top-0 bg-gray-100 z-10">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((booking) => (
                  <tr key={booking._id} className="border-b hover:bg-gray-55">
                    <td className="p-3 font-semibold text-gray-800">{booking.passengerName}</td>
                    <td className="p-3">{booking.cnic}</td>
                    <td className="p-3 font-medium text-green-900">{booking.train?.trainName}</td>
                    <td className="p-3 text-sm">{booking.train?.source} → {booking.train?.destination}</td>
                    <td className="p-3 text-sm">{booking.coachNumber || "—"}</td>
                    <td className="p-3 text-sm">
                      {booking.selectedSeats && booking.selectedSeats.length > 0
                        ? `${booking.selectedSeats.map((s) => (s?.coach && s?.number ? `${s.coach}-${s.number}` : s?.number || s)).join(", ")} (${booking.seatsBooked})`
                        : `Seat ${booking.seatNumber || "—"} (${booking.seatsBooked})`}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : booking.status === "Pending Verification"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-3 text-sm">{new Date(booking.createdAt).toLocaleDateString()}</td>
                    <td className="p-3 text-sm font-medium">
                      {booking.cancelledAt
                        ? new Date(booking.cancelledAt).toLocaleDateString()
                        : booking.status === "cancelled"
                        ? new Date(booking.updatedAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => deleteBooking(booking._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                      >
                        Delete
                      </button>
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

export default ManageBookings;