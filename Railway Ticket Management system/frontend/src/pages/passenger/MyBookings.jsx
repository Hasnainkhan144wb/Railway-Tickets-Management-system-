import {
    useEffect,
    useState,
} from "react";

import axios from "axios";

import DashboardLayout from "../../components/DashboardLayout";

import jsPDF from "jspdf";


const MyBookings = () => {

    const [bookings, setBookings] =
        useState([]);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [bookingToCancel, setBookingToCancel] = useState(null);

    const user = JSON.parse(
        localStorage.getItem("user")
    );


    // FETCH BOOKINGS

    const fetchBookings =
        async () => {

            try {

                const res =
                    await axios.get(
                        `http://localhost:5000/api/bookings/user/${user.id}`
                    );

                setBookings(
                    res.data.filter(b => b.status !== "cancelled")
                );

            } catch (error) {

                console.log(error);
            }
        };


    useEffect(() => {

        fetchBookings();

    }, []);


    // CANCEL TICKET

    const cancelTicket =
        async (id) => {

            try {

                await axios.put(
                    `http://localhost:5000/api/bookings/cancel/${id}`
                );

                alert(
                    "Ticket Cancelled Successfully"
                );

                fetchBookings();

            } catch (error) {

                console.log(error);
            }
        };

    const handleCancelClick = (id) => {
        setBookingToCancel(id);
        setShowCancelModal(true);
    };


    // PAYMENT DONE

    const makePayment =
        async (id) => {

            try {

                await axios.put(
                    `http://localhost:5000/api/bookings/payment/${id}`
                );

                alert(
                    "Payment Submitted Successfully"
                );

                fetchBookings();

            } catch (error) {

                console.log(error);
            }
        };


    // DOWNLOAD E-TICKET PDF

    const downloadTicket =
        (booking) => {

            if (!booking.verified) {

                return alert(
                    "Ticket is not verified by staff yet"
                );
            }

            const doc =
                new jsPDF();

            // HEADER

            doc.setFontSize(22);

            doc.text(
                "Railway E-Ticket",
                70,
                20
            );

            doc.line(
                20,
                30,
                190,
                30
            );

            // PASSENGER INFO

            doc.setFontSize(14);

            doc.text(
                `Passenger Name: ${booking.passengerName}`,
                20,
                50
            );

            doc.text(
                `CNIC: ${booking.cnic}`,
                20,
                65
            );

            doc.text(
                `Payment ID: ${booking.paymentId}`,
                20,
                80
            );

            doc.text(
                `Coach: ${booking.coachNumber}`,
                20,
                95
            );

            doc.text(
                `Seats: ${booking.selectedSeats && booking.selectedSeats.length > 0 ? (booking.selectedSeats.map(s => s && typeof s === 'object' && s.coach && s.number ? `${s.coach}-${s.number}` : (s && typeof s === 'object' ? s.number || "" : s)).filter(Boolean).join(", ") || booking.seatNumber || "-") : booking.seatNumber || "-"}`,
                20,
                110
            );

            // TRAIN INFO

            doc.text(
                `Train: ${booking.train?.trainName}`,
                20,
                130
            );

            doc.text(
                `Source: ${booking.train?.source}`,
                20,
                160
            );

            doc.text(
                `Destination: ${booking.train?.destination}`,
                20,
                175
            );

            doc.text(
                `Departure Time: ${booking.train?.departureTime}`,
                20,
                190
            );

            doc.text(
                `Seats Booked: ${booking.seatsBooked}`,
                20,
                205
            );

            doc.text(
                `Payment Status: ${booking.paymentStatus}`,
                20,
                220
            );

            doc.text(
                `Verification: Verified`,
                20,
                235
            );

            doc.save(
                "railway-ticket.pdf"
            );
        };


    // PRINT TICKET

    const printTicket =
        (booking) => {

            if (!booking.verified) {

                return alert(
                    "Ticket is not verified by staff yet"
                );
            }

            const printWindow =
                window.open(
                    "",
                    "_blank"
                );

            printWindow.document.write(`

        <html>

          <head>

            <title>
              Railway E-Ticket
            </title>

            <style>

              body {
                font-family: Arial;
                padding: 40px;
              }

              h1 {
                color: #1e3a8a;
              }

              .ticket {
                border: 2px solid #1e3a8a;
                padding: 20px;
                border-radius: 10px;
              }

            </style>

          </head>

          <body>

            <div class="ticket">

              <h1>
                Railway E-Ticket
              </h1>

              <hr />

              <p>
                <strong>Passenger:</strong>
                ${booking.passengerName}
              </p>

              <p>
                <strong>CNIC:</strong>
                ${booking.cnic}
              </p>

              <p>
                <strong>Payment ID:</strong>
                ${booking.paymentId}
              </p>

              <p>
                <strong>Coach:</strong>
                ${booking.coachNumber}
              </p>

              <p>
                <strong>Seats:</strong>
                ${booking.selectedSeats && booking.selectedSeats.length > 0 ? booking.selectedSeats.join(", ") : booking.seatNumber || "-"}
              </p>

              <p>
                <strong>Train:</strong>
                ${booking.train?.trainName}
              </p>

              <p>
                <strong>Route:</strong>
                ${booking.train?.source}
                →
                ${booking.train?.destination}
              </p>

              <p>
                <strong>Departure:</strong>
                ${booking.train?.departureTime}
              </p>

              <p>
                <strong>Seats:</strong>
                ${booking.seatsBooked}
              </p>

              <p>
                <strong>Status:</strong>
                ${booking.status}
              </p>

              <p>
                <strong>Payment:</strong>
                ${booking.paymentStatus}
              </p>

              <p>
                <strong>Verification:</strong>
                Verified
              </p>

            </div>

          </body>

        </html>

      `);

            printWindow.document.close();

            printWindow.print();
        };


    return (

        <DashboardLayout>

            {/* HEADER */}

            <div className="mb-8">

                <h1 className="text-4xl font-bold text-gray-800">
                    My Bookings
                </h1>

                <p className="text-gray-500 mt-2">
                    View and manage your booked tickets.
                </p>

            </div>


            {/* BOOKINGS TABLE */}

            <div className="bg-white shadow-md rounded-xl p-6 border overflow-auto max-h-[500px]">

                <table className="w-full text-left border-collapse">

                    <thead>

                        <tr className="bg-gray-100">

                            <th className="p-3 sticky top-0 bg-gray-100 z-10">
                                Train
                            </th>

                            <th className="p-3 sticky top-0 bg-gray-100 z-10">
                                Route
                            </th>

                            <th className="p-3 sticky top-0 bg-gray-100 z-10">
                                Departure
                            </th>

                            <th className="p-3 sticky top-0 bg-gray-100 z-10">
                                Seats
                            </th>

                            <th className="p-3 sticky top-0 bg-gray-100 z-10">
                                Coach
                            </th>

                            <th className="p-3 sticky top-0 bg-gray-100 z-10">
                                Seats
                            </th>

                            <th className="p-3 sticky top-0 bg-gray-100 z-10">
                                Booking Date
                            </th>

                            <th className="p-3 sticky top-0 bg-gray-100 z-10">
                                Payment ID
                            </th>

                            <th className="p-3 sticky top-0 bg-gray-100 z-10">
                                Payment Status
                            </th>

                            <th className="p-3 sticky top-0 bg-gray-100 z-10">
                                Verification
                            </th>

                            <th className="p-3 sticky top-0 bg-gray-100 z-10">
                                Status
                            </th>

                            <th className="p-3 sticky top-0 bg-gray-100 z-10">
                                Actions
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {bookings.map(
                            (booking) => (

                                <tr
                                    key={booking._id}
                                    className="border-b hover:bg-gray-50"
                                >

                                    <td className="p-3 font-semibold">

                                        {
                                            booking.train
                                                ?.trainName
                                        }

                                    </td>


                                    <td className="p-3">

                                        {
                                            booking.train
                                                ?.source
                                        }
                                        {" → "}
                                        {
                                            booking.train
                                                ?.destination
                                        }

                                    </td>


                                    <td className="p-3">

                                        {
                                            booking.train
                                                ?.departureTime
                                        }

                                    </td>


                                    <td className="p-3">

                                        {
                                            booking.seatsBooked
                                        }

                                    </td>

                                    <td className="p-3">
                                        {booking.coachNumber}
                                    </td>

                                    <td className="p-3">
                                        {booking.selectedSeats && booking.selectedSeats.length > 0 
                                            ? (booking.selectedSeats.map(s => s && typeof s === 'object' && s.coach && s.number ? `${s.coach}-${s.number}` : (s && typeof s === 'object' ? s.number || "" : s)).filter(Boolean).join(", ") || booking.seatNumber || "-") 
                                            : booking.seatNumber || "-"}
                                    </td>

                                    <td className="p-3">
                                        {new Date(
                                            booking.createdAt
                                        ).toLocaleDateString()}
                                    </td>


                                    {/* PAYMENT ID */}

                                    <td className="p-3 text-blue-700 font-bold">

                                        {
                                            booking.paymentId
                                        }

                                    </td>


                                    {/* PAYMENT STATUS */}

                                    <td className="p-3">

                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-semibold
                                            ${booking.paymentStatus ===
                                                    "paid"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                                }`}
                                        >

                                            {
                                                booking.paymentStatus
                                            }

                                        </span>

                                    </td>


                                    {/* VERIFIED */}

                                    <td className="p-3">

                                        {
                                            booking.verified
                                                ? (
                                                    <span className="text-green-600 font-semibold">
                                                        Verified
                                                    </span>
                                                )
                                                : (
                                                    <span className="text-red-600 font-semibold">
                                                        Pending
                                                    </span>
                                                )
                                        }

                                    </td>


                                    {/* BOOKING STATUS */}

                                    <td className="p-3">

                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-semibold
                                            ${booking.status === "confirmed"
                                                    ? "bg-green-100 text-green-700"
                                                    : booking.status === "Pending Verification"
                                                    ? "bg-amber-100 text-amber-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}
                                        >

                                            {
                                                booking.status
                                            }

                                        </span>

                                    </td>


                                    {/* ACTIONS */}

                                    <td className="p-3 flex flex-col gap-2">
                                        <div className="flex flex-wrap gap-2">
                                            {/* PAYMENT BUTTON */}
                                            {booking.paymentStatus !== "paid" && (
                                                <button
                                                    onClick={() => makePayment(booking._id)}
                                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
                                                >
                                                    Pay Now
                                                </button>
                                            )}

                                            {/* DOWNLOAD */}
                                            <button
                                                disabled={!booking.verified}
                                                onClick={() => downloadTicket(booking)}
                                                className={`px-4 py-2 rounded-lg font-medium transition ${
                                                    booking.verified
                                                        ? "bg-blue-900 hover:bg-blue-800 text-white cursor-pointer"
                                                        : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                                                }`}
                                            >
                                                Download
                                            </button>

                                            {/* CANCEL */}
                                            {booking.status === "confirmed" && (
                                                <button
                                                    onClick={() => handleCancelClick(booking._id)}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                        {!booking.verified && (
                                            <span className="text-[10px] text-amber-600 font-semibold block">
                                                E-Ticket download will be available after verification.
                                            </span>
                                        )}
                                    </td>

                                </tr>

                            )
                        )}

                    </tbody>

                </table>

            </div>

            {showCancelModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[30000] animate-fadeIn">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-2 bg-red-500" />
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6 text-red-600 border border-red-100">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                Confirm Ticket Cancellation
                            </h3>
                            
                            <p className="text-gray-600 text-sm leading-relaxed mb-8">
                                Are you sure you want to cancel this ticket?
                            </p>
                            
                            <div className="flex gap-4 w-full">
                                <button
                                    onClick={() => {
                                        cancelTicket(bookingToCancel);
                                        setShowCancelModal(false);
                                        setBookingToCancel(null);
                                    }}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md"
                                >
                                    Yes, Cancel Ticket
                                </button>
                                <button
                                    onClick={() => {
                                        setShowCancelModal(false);
                                        setBookingToCancel(null);
                                    }}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all"
                                >
                                    No, Keep Ticket
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </DashboardLayout>
    );
};

export default MyBookings;