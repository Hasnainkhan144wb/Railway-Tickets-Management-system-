import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout";
import { FaCheckCircle, FaExclamationTriangle, FaQrcode, FaCamera, FaSearch } from "react-icons/fa";

const VerifyTickets = ({ isSubView }) => {
  const [bookings, setBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scannedId, setScannedId] = useState("");

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
      if (scanResult && scanResult._id === id) {
        setScanResult(prev => ({ ...prev, verified: true }));
      }
    } catch (error) {
      console.log(error);
      alert("Verification failed.");
    }
  };

  // Simulate QR Code Camera scan
  const startQRScanner = () => {
    setScanning(true);
    setScanResult(null);
    setTimeout(() => {
      // Pick a random paid booking to simulate a scan
      const paidBookings = bookings.filter(b => b.paymentStatus === "paid");
      if (paidBookings.length > 0) {
        const randomBooking = paidBookings[Math.floor(Math.random() * paidBookings.length)];
        setScanResult(randomBooking);
        setScannedId(randomBooking.paymentId || randomBooking._id);
      } else {
        alert("No valid paid tickets in the system to scan.");
      }
      setScanning(false);
    }, 2500); // 2.5s scanner animation
  };

  // Manual Scan ID submission
  const handleManualScan = (e) => {
    e.preventDefault();
    if (!scannedId.trim()) return;

    const match = bookings.find(
      b => b.paymentId === scannedId.trim() || b._id === scannedId.trim()
    );

    if (match) {
      setScanResult(match);
    } else {
      alert("Ticket details not found. Expired or Invalid QR Code.");
      setScanResult({
        invalid: true,
        paymentId: scannedId
      });
    }
  };

  const getFilteredBookings = () => {
    return bookings.filter(b => {
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

        {/* QR SCANNER & MANUAL VERIFIER */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* CAMERA SCANNER */}
          <div className="bg-white p-6 rounded-3xl border shadow-sm flex flex-col justify-between h-80">
            <div>
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <FaQrcode className="text-green-900" /> QR Code Scanner
              </h3>
              <p className="text-xs text-gray-400 mt-1 font-medium">Scan passenger QR ticket code to check authenticity.</p>
            </div>

            {scanning ? (
              <div className="flex-1 flex flex-col justify-center items-center relative my-4 bg-gray-950 rounded-2xl overflow-hidden border border-gray-800">
                <div className="absolute inset-x-0 top-0 h-0.5 bg-green-500 animate-bounce" />
                <FaCamera className="text-gray-500 animate-pulse mb-2" size={32} />
                <span className="text-green-400 text-xs font-bold uppercase tracking-wider">Accessing Viewfinder...</span>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-center items-center my-4 bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-4 text-center">
                <FaQrcode className="text-gray-300 mb-2" size={48} />
                <span className="text-xs text-gray-500 font-semibold">Ready to Scan</span>
              </div>
            )}

            <button
              onClick={startQRScanner}
              disabled={scanning}
              className="bg-green-900 hover:bg-green-800 text-white font-bold py-3 px-4 rounded-xl transition text-center w-full"
            >
              {scanning ? "Scanning QR Code..." : "Simulate Camera QR Scan"}
            </button>
          </div>

          {/* SCANNER DETAILS */}
          <div className="bg-white p-6 rounded-3xl border shadow-sm flex flex-col lg:col-span-2 h-80 overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Ticket Verification Result</h3>
            
            {scanResult ? (
              scanResult.invalid ? (
                <div className="flex-1 flex flex-col items-center justify-center bg-red-50 border border-red-200 p-4 rounded-2xl text-center">
                  <FaExclamationTriangle className="text-red-500 mb-2" size={32} />
                  <h4 className="text-sm font-bold text-red-700">Invalid QR Ticket Code</h4>
                  <p className="text-xs text-red-500 mt-1">
                    No matching booking record found for payment ID: <span className="font-mono font-bold">{scanResult.paymentId}</span>
                  </p>
                </div>
              ) : (
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-xs font-semibold text-gray-400">Passenger:</span>
                    <span className="text-sm font-bold text-gray-800">{scanResult.passengerName}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-xs font-semibold text-gray-400">CNIC:</span>
                    <span className="text-sm font-bold text-gray-800">{scanResult.cnic}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-xs font-semibold text-gray-400">Train Route:</span>
                    <span className="text-sm font-bold text-gray-800">{scanResult.train?.trainName} ({scanResult.train?.source} → {scanResult.train?.destination})</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-xs font-semibold text-gray-400">Status:</span>
                    <span className={`text-xs font-bold uppercase ${scanResult.verified ? "text-blue-600" : "text-amber-500"}`}>
                      {scanResult.verified ? "Verified / Boarded" : "Pending Verification"}
                    </span>
                  </div>
                  {!scanResult.verified && (
                    <button
                      onClick={() => verifyHandler(scanResult._id)}
                      className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs w-full transition"
                    >
                      Confirm Boarding & Mark as Boarded
                    </button>
                  )}
                </div>
              )
            ) : (
              <div className="flex-1 flex flex-col justify-center items-center text-gray-300">
                <FaCheckCircle size={48} />
                <span className="text-xs text-gray-400 font-semibold mt-2">Scan a ticket to view validation stats</span>
              </div>
            )}
          </div>
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