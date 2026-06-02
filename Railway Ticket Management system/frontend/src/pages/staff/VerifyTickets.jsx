import {
    useEffect,
    useState,
} from "react";

import axios from "axios";

import DashboardLayout from "../../components/DashboardLayout";


const VerifyTickets = () => {

    const [bookings, setBookings] =
        useState([]);


    // FETCH BOOKINGS

    const fetchBookings =
        async () => {

            try {

                const res =
                    await axios.get(
                        "http://localhost:5000/api/bookings"
                    );

                setBookings(
                    res.data
                );

            } catch (error) {

                console.log(error);
            }
        };


    useEffect(() => {

        fetchBookings();

    }, []);


    // VERIFY TICKET

    const verifyHandler =
        async (id) => {

            try {

                await axios.put(
                    `http://localhost:5000/api/bookings/verify/${id}`
                );

                alert(
                    "Ticket Verified Successfully"
                );

                fetchBookings();

            } catch (error) {

                console.log(error);
            }
        };


    return (

        <DashboardLayout>

            {/* HEADER */}

            <div className="mb-8">

                <h1 className="text-4xl font-bold text-gray-800">
                    Verify Passenger Tickets
                </h1>

                <p className="text-gray-500 mt-2">
                    Verify passenger payments and railway tickets.
                </p>

            </div>


            {/* TABLE */}

            <div className="bg-white shadow-md rounded-xl p-6 border">

                <div className="overflow-auto max-h-[500px]">

                    <table className="w-full text-left border-collapse">

                        <thead>

                            <tr className="bg-gray-100">

                                <th className="p-3 sticky top-0 bg-gray-100 z-10">
                                    Passenger
                                </th>

                                <th className="p-3 sticky top-0 bg-gray-100 z-10">
                                    CNIC
                                </th>

                                <th className="p-3 sticky top-0 bg-gray-100 z-10">
                                    Train
                                </th>

                                <th className="p-3 sticky top-0 bg-gray-100 z-10">
                                    Route
                                </th>

                                <th className="p-3 sticky top-0 bg-gray-100 z-10">
                                    Coach
                                </th>

                                <th className="p-3 sticky top-0 bg-gray-100 z-10">
                                    Seats
                                </th>

                                <th className="p-3 sticky top-0 bg-gray-100 z-10">
                                    Payment ID
                                </th>

                                <th className="p-3 sticky top-0 bg-gray-100 z-10">
                                    Payment Status
                                </th>

                                <th className="p-3 sticky top-0 bg-gray-100 z-10">
                                    Booking Status
                                </th>

                                <th className="p-3 sticky top-0 bg-gray-100 z-10">
                                    Verification
                                </th>

                                <th className="p-3 sticky top-0 bg-gray-100 z-10">
                                    Action
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

                                        {/* PASSENGER */}

                                        <td className="p-3 font-semibold">

                                            {
                                                booking.passengerName
                                            }

                                        </td>


                                        {/* CNIC */}

                                        <td className="p-3">

                                            {
                                                booking.cnic
                                            }

                                        </td>


                                        {/* TRAIN */}

                                        <td className="p-3">

                                            {
                                                booking.train
                                                    ?.trainName
                                            }

                                        </td>


                                        {/* ROUTE */}

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


                                        {/* COACH */}
                                        <td className="p-3">
                                            {booking.coachNumber || "—"}
                                        </td>

                                        {/* SEATS */}
                                        <td className="p-3">
                                            {booking.selectedSeats && booking.selectedSeats.length > 0
                                                ? `${(booking.selectedSeats.map(s => s && typeof s === 'object' && s.coach && s.number ? `${s.coach}-${s.number}` : (s && typeof s === 'object' ? s.number || "" : s)).filter(Boolean).join(", ") || booking.seatNumber || "—")} (${booking.seatsBooked})`
                                                : `Seat ${booking.seatNumber || "—"} (${booking.seatsBooked})`}
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


                                        {/* BOOKING STATUS */}

                                        <td className="p-3">

                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-semibold
                                                ${booking.status ===
                                                        "confirmed"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                    }`}
                                            >

                                                {
                                                    booking.status
                                                }

                                            </span>

                                        </td>


                                        {/* VERIFY STATUS */}

                                        <td className="p-3">

                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-semibold
                                                ${booking.verified
                                                        ? "bg-blue-100 text-blue-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                    }`}
                                            >

                                                {
                                                    booking.verified
                                                        ? "Verified"
                                                        : "Pending"
                                                }

                                            </span>

                                        </td>


                                        {/* ACTION */}

                                        <td className="p-3">

                                            {!booking.verified &&
                                                booking.paymentStatus ===
                                                "paid" && (

                                                    <button
                                                        onClick={() =>
                                                            verifyHandler(
                                                                booking._id
                                                            )
                                                        }
                                                        className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg"
                                                    >
                                                        Verify
                                                    </button>

                                                )}


                                            {!booking.verified &&
                                                booking.paymentStatus !==
                                                "paid" && (

                                                    <span className="text-red-500 font-semibold">
                                                        Waiting for Payment
                                                    </span>

                                                )}

                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </DashboardLayout>
    );
};

export default VerifyTickets;