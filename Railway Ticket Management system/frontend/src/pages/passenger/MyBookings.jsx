import {
    useEffect,
    useState,
} from "react";

import axios from "axios";

import DashboardLayout from "../../components/DashboardLayout";

import jsPDF from "jspdf";
import QRCode from "qrcode";


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

    // DOWNLOAD E-TICKET PDF

    const downloadTicket =
        async (booking) => {

            if (!booking.verified) {

                return alert(
                    "Ticket is not verified by staff yet"
                );
            }

            const doc =
                new jsPDF({
                    orientation: "portrait",
                    unit: "mm",
                    format: "a4"
                });

            // Helper to format date
            const formatDateStr = (dateStr) => {
                if (!dateStr) return "TBD";
                const parts = String(dateStr).split('T')[0].split('-');
                if (parts.length === 3) {
                    if (parts[0].length === 4) {
                        return `${parts[2]}-${parts[1]}-${parts[0]}`;
                    }
                    return `${parts[0]}-${parts[1]}-${parts[2]}`;
                }
                const d = new Date(dateStr);
                const day = String(d.getDate()).padStart(2, '0');
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const year = d.getFullYear();
                return `${day}-${month}-${year}`;
            };

            // Helper to calculate arrival
            const calculateArrival = (depTime) => {
                if (!depTime) return "TBD";
                const match = depTime.match(/(\d+):(\d+)\s*(AM|PM)?/i);
                if (!match) return depTime;
                let hours = parseInt(match[1]);
                const minutes = match[2];
                const ampm = match[3];

                hours += 8;

                if (ampm) {
                    if (hours >= 12) {
                        const extra = Math.floor(hours / 12);
                        let nextHours = hours % 12;
                        if (nextHours === 0) nextHours = 12;
                        let nextAmpm = ampm.toUpperCase() === "AM" ? "PM" : "AM";
                        if (extra % 2 === 0) {
                            nextAmpm = ampm.toUpperCase();
                        }
                        return `${String(nextHours).padStart(2, '0')}:${minutes} ${nextAmpm}`;
                    }
                    return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
                } else {
                    hours = hours % 24;
                    return `${String(hours).padStart(2, '0')}:${minutes}`;
                }
            };

            // Helper to get payment method
            const getPaymentMethodDisplay = (method) => {
                if (!method) return "Challan";
                const lower = method.toLowerCase();
                if (lower === "challan") return "Challan";
                if (lower === "card") return "Card";
                if (lower === "wallet") return "JazzCash / EasyPaisa";
                return method;
            };

            const basePrice = (booking.selectedSeats?.length || booking.seatsBooked || 1) * (booking.train?.ticketPrice || 0);
            const fee = Math.round(basePrice * 0.05);
            const total = basePrice + fee;

            const uniqueCoaches = booking.coachNumber || "-";
            const formattedSeats = booking.selectedSeats && booking.selectedSeats.length > 0 ? (booking.selectedSeats.map(s => s && typeof s === 'object' && s.coach && s.number ? `${s.coach}-${s.number}` : (s && typeof s === 'object' ? s.number || "" : s)).filter(Boolean).join(", ") || booking.seatNumber || "-") : booking.seatNumber || "-";
            const travelDateFormatted = formatDateStr(booking.train?.travelDate);
            const arrivalTimeComputed = calculateArrival(booking.train?.departureTime);
            const paymentMethodDisplay = getPaymentMethodDisplay(booking.paymentMethod || "Challan");

            // Helper to format date pretty (e.g. 28 May 2019)
            const formatDateStrPretty = (dateStr) => {
                if (!dateStr) return "TBD";
                const d = new Date(dateStr);
                const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                const day = d.getDate();
                const month = months[d.getMonth()];
                const year = d.getFullYear();
                return `${day} ${month} ${year}`;
            };

            const travelDatePretty = formatDateStrPretty(booking.train?.travelDate);
            const statusDisplay = booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : "Confirmed";

            // QR Code plain text content
            const qrText = `Passenger: ${booking.passengerName}
CNIC: ${booking.cnic}
Mobile: ${booking.phone || "-"}
Train: ${booking.train?.trainName || ""}
From: ${booking.train?.source || ""}
To: ${booking.train?.destination || ""}
Date: ${travelDatePretty}
Departure: ${booking.train?.departureTime || ""}
Arrival: ${arrivalTimeComputed}
Coach: ${uniqueCoaches}
Seat: ${formattedSeats}
Payment ID: ${booking.paymentId || ""}
Status: ${statusDisplay}`;

            let qrDataUrl = "";
            try {
                qrDataUrl = await QRCode.toDataURL(qrText, { margin: 1, width: 150 });
            } catch (err) {
                console.error("Failed to generate QR Code", err);
            }

            // Generate Text-based/Graphical Layout matching the reference image
            // Draw Main Outer Border
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.3);
            doc.rect(15, 15, 180, 265);

            // 1. Header Section (Pakistan Railways Logo & text block)
            // PR Green Header Box/Emblem
            doc.setFillColor(16, 124, 65);
            doc.rect(20, 20, 15, 15, "F");
            doc.setTextColor(255, 255, 255);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.text("PR", 23, 30);

            // English & Urdu text header
            doc.setTextColor(16, 124, 65);
            doc.setFontSize(22);
            doc.text("PAKISTAN RAILWAYS", 42, 29);
            doc.setFontSize(14);
            doc.text("pakistan Zindabad ", 42, 34);

            doc.setDrawColor(220, 220, 220);
            doc.line(15, 40, 195, 40);

            // 2. Journey Information (Train, Route, Coach, Travel Date)
            doc.setTextColor(0, 0, 0);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.text(booking.train?.trainName || "", 20, 50);

            const routeStr = `${booking.train?.source} to ${booking.train?.destination}`.toUpperCase();
            doc.text(routeStr, 110, 50);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(80, 80, 80);
            doc.text(`Coach No : ${uniqueCoaches} / ${booking.seatType}`, 20, 60);
            doc.text(`Travel Date : ${travelDatePretty} ${booking.train?.departureTime || ""}`, 110, 60);

            doc.line(15, 68, 195, 68);

            // 3. Order Information


            // 4. Passenger & Booking Details Table
            // Table Header Background
            doc.setFillColor(248, 250, 252);
            doc.rect(15, 80, 180, 8, "F");
            doc.setFont("helvetica", "bold");
            doc.setFontSize(9);
            doc.setTextColor(100, 116, 139);
            doc.text("Seat No", 20, 85);
            doc.text("Name", 45, 85);
            doc.text("CNIC", 90, 85);
            doc.text("Mobile No", 135, 85);
            doc.text("Fare", 175, 85);
            doc.line(15, 88, 195, 88);

            // Table Body
            let currentY = 94;
            const seatsList = booking.selectedSeats && booking.selectedSeats.length > 0
                ? booking.selectedSeats
                : [{ coach: booking.coachNumber || "-", number: booking.seatNumber || "-" }];

            seatsList.forEach((seat) => {
                const seatStr = typeof seat === 'object' ? `${seat.coach}-${seat.number}` : seat;
                const pName = booking.passengerName;
                const pCnic = booking.cnic;
                const pMobile = booking.phone || "-";
                const pFare = (booking.train?.ticketPrice || 0).toFixed(2);

                doc.setFont("helvetica", "normal");
                doc.setFontSize(9);
                doc.setTextColor(30, 41, 59);
                doc.text(String(seatStr), 20, currentY);
                doc.text(String(pName), 45, currentY);
                doc.text(String(pCnic), 90, currentY);
                doc.text(String(pMobile), 135, currentY);
                doc.text(String(pFare), 175, currentY);

                currentY += 8;
            });
            doc.line(15, currentY - 2, 195, currentY - 2);

            // 5. Fare Summary
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.setTextColor(15, 23, 42);
            const totalAmountStr = (seatsList.length * (booking.train?.ticketPrice || 0)).toFixed(2);
            doc.text(`Total (Excluding charges): Rs. ${totalAmountStr}`, 120, currentY + 4);

            currentY += 10;
            doc.line(15, currentY, 195, currentY);

            // 6. Ticket Footer Message
            doc.setFont("helvetica", "italic");
            doc.setFontSize(9);
            doc.setTextColor(71, 85, 105);
            doc.text("This is an electronic ticket generated by Pakistan Railways. Thank you for journey with us!", 32, currentY + 6);

            currentY += 12;
            doc.line(15, currentY, 195, currentY);

            // 7. QR Code section
            if (qrDataUrl) {
                doc.addImage(qrDataUrl, "PNG", 85, currentY + 4, 38, 38);
            }

            currentY += 46;
            doc.line(15, currentY, 195, currentY);

            // 8. Important Notes
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.setTextColor(15, 23, 42);
            doc.text("Note:", 20, currentY + 6);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(71, 85, 105);
            doc.text("• A traveler must provide his/her original Name, CNIC No and Mobile No.", 20, currentY + 12);
            doc.text("• Traveling with fake information on Ticket is not allowed.", 20, currentY + 18);

            doc.save(`railway-ticket-${booking.paymentId || "ticket"}.pdf`);
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

                                            <button
                                                disabled={!booking.verified}
                                                onClick={() => downloadTicket(booking)}
                                                className={`px-4 py-2 rounded-lg font-medium transition ${booking.verified
                                                    ? "bg-blue-900 hover:bg-blue-800 text-white cursor-pointer"
                                                    : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                                                    }`}
                                            >
                                                Download E-Ticket
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