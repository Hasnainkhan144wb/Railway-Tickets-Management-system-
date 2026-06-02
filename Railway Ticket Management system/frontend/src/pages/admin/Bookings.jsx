import {
    useEffect,
    useState,
} from "react";

import axios from "axios";

import DashboardLayout from "../../components/DashboardLayout";

const BookingRecords = () => {

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

    return (

        <DashboardLayout>

            {/* HEADER */}

            <div className="mb-8">

                <h1 className="text-4xl font-bold text-gray-800">
                    Booking Records
                </h1>

                <p className="text-gray-500 mt-2">
                    View complete passenger booking records.
                </p>

            </div>


            {/* RECORD TABLE */}

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
                                    Status
                                </th>

                                <th className="p-3 sticky top-0 bg-gray-100 z-10">
                                    Booking Date
                                </th>

                                <th className="p-3 sticky top-0 bg-gray-100 z-10">
                                    Cancel Date
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

                                        {/* PASSENGER NAME */}

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


                                        {/* STATUS */}

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


                                        {/* BOOKING DATE */}

                                        <td className="p-3">

                                            {
                                                new Date(
                                                    booking.createdAt
                                                ).toLocaleDateString()
                                            }

                                        </td>


                                        {/* CANCEL DATE */}

                                        <td className="p-3">

                                            {
                                                booking.status ===
                                                    "cancelled"

                                                    ? new Date(
                                                        booking.updatedAt
                                                    ).toLocaleDateString()

                                                    : "—"
                                            }

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

export default BookingRecords;