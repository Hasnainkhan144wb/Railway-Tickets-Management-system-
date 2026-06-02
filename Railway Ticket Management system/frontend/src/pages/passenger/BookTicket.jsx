import {
    useEffect,
    useState,
} from "react";

import axios from "axios";

import DashboardLayout from "../../components/DashboardLayout";

import jsPDF from "jspdf";

import {
    FaTimes,
} from "react-icons/fa";

import SeatMap from "../../components/SeatMap";


const BookTicket = () => {
    const [coachNumber, setCoachNumber] =
        useState("");

    const [trains, setTrains] =
        useState([]);

    const [filteredTrains,
        setFilteredTrains] =
        useState([]);

    const [selectedTrain,
        setSelectedTrain] =
        useState(null);

    const [seatsBooked,
        setSeatsBooked] =
        useState(1);

    const [passengerName,
        setPassengerName] =
        useState("");

    const [cnic,
        setCnic] =
        useState("");

    const [paymentId,
        setPaymentId] =
        useState("");

    const [showPaymentModal,
        setShowPaymentModal] =
        useState(false);

    const [selectedSeats, setSelectedSeats] =
        useState([]);


    // SEARCH STATES

    const [source,
        setSource] =
        useState("");

    const [destination,
        setDestination] =
        useState("");

    const [departureTime,
        setDepartureTime] =
        useState("");


    const user = JSON.parse(
        localStorage.getItem("user")
    );


    // FETCH TRAINS

    const fetchTrains =
        async () => {

            try {

                const res =
                    await axios.get(
                        "http://localhost:5000/api/trains"
                    );

                setTrains(res.data);

                setFilteredTrains(
                    res.data
                );

            } catch (error) {

                console.log(error);
            }
        };


    useEffect(() => {

        fetchTrains();

    }, []);


    // SEARCH TRAINS

    const searchTrains = () => {

        const filtered =
            trains.filter((train) => {

                return (

                    train.source
                        .toLowerCase()
                        .includes(
                            source.toLowerCase()
                        )

                    &&

                    train.destination
                        .toLowerCase()
                        .includes(
                            destination.toLowerCase()
                        )

                    &&

                    train.departureTime
                        .toLowerCase()
                        .includes(
                            departureTime.toLowerCase()
                        )

                );
            });

        setFilteredTrains(
            filtered
        );
    };


    // OPEN BOOKING MODAL

    const openBookingModal =
        (train) => {

            setSelectedTrain(train);

            setShowPaymentModal(false);

            setCoachNumber(train.coaches?.[0]?.coachNumber || "C1");

            setSelectedSeats([]);
        };

    // CLOSE MODAL

const closeModal = () => {

    setSelectedTrain(null);

    setPassengerName("");

    setCnic("");

    setSeatsBooked(1);

    setCoachNumber("");

    setSelectedSeats([]);

    setShowPaymentModal(false);
};


    const generatePayment =
        () => {

            if (
                passengerName.trim() === ""
            ) {

                return alert(
                    "Please enter full name"
                );
            }

            if (
                !cnic || cnic.trim().length !== 13 || !/^\d{13}$/.test(cnic)
            ) {

                return alert(
                    "CNIC must be exactly 13 digits"
                );
            }

            if (selectedSeats.length === 0) {

                return alert(
                    "Please select at least 1 seat/berth"
                );
            }

            if (selectedSeats.length > 8) {

                return alert(
                    "Maximum 8 seats allowed"
                );
            }

            // RANDOM 8 DIGIT PAYMENT ID

            const randomId =
                Math.floor(
                    10000000 +
                    Math.random() * 90000000
                );

            setPaymentId(randomId);

            setShowPaymentModal(true);
        };


    // DOWNLOAD CHALLAN

    const downloadChallan =
        () => {

            const doc =
                new jsPDF();

            doc.setFontSize(22);

            doc.text(
                "Railway Payment Challan",
                45,
                20
            );

            doc.line(
                20,
                30,
                190,
                30
            );

            doc.setFontSize(14);

            doc.text(
                `Passenger Name: ${passengerName}`,
                20,
                50
            );

            doc.text(
                `CNIC: ${cnic}`,
                20,
                65
            );

            doc.text(
                `Train Name: ${selectedTrain.trainName}`,
                20,
                80
            );

            doc.text(
                `Source: ${selectedTrain.source}`,
                20,
                95
            );

            doc.text(
                `Destination: ${selectedTrain.destination}`,
                20,
                110
            );

            const uniqueCoaches = [...new Set(selectedSeats.map(s => s.coach))].sort().join(", ");
            const formattedSeats = selectedSeats.map(s => `${s.coach}-${s.number}`).join(", ");

            doc.text(
                `Coach: ${uniqueCoaches}`,
                20,
                125
            );

            doc.text(
                `Seats: ${formattedSeats}`,
                20,
                140
            );

            doc.text(
                `Number of Seats: ${selectedSeats.length}`,
                20,
                155
            );

            doc.text(
                `Price Per Seat: Rs. ${selectedTrain.ticketPrice}`,
                20,
                170
            );

            doc.text(
                `Total Fare: Rs. ${selectedSeats.length * selectedTrain.ticketPrice}`,
                20,
                185
            );

            doc.text(
                `Payment ID: ${paymentId}`,
                20,
                200
            );

            doc.text(
                "Please pay through any banking app using this Payment ID.",
                20,
                225
            );

            doc.save(
                "railway-payment-challan.pdf"
            );
        };


    // FINAL BOOKING

    const handleBooking =
        async () => {

            try {

                await axios.post(
                    "http://localhost:5000/api/bookings",
                    {
                        user: user.id,

                        train:
                            selectedTrain._id,

                        seatsBooked: selectedSeats.length,

                        passengerName,

                        cnic,

                        paymentId,

                        coachNumber,

                        selectedSeats,
                    }
                );

                alert(
                    "Ticket Booked Successfully"
                );

                fetchTrains();

                closeModal();

            } catch (error) {

                alert(
                    error.response.data.message
                );
            }
        };


    return (

        <DashboardLayout>

            {/* HEADER */}

            <div className="mb-8">

                <h1 className="text-4xl font-bold text-gray-800">
                    Search & Book Trains
                </h1>

                <p className="text-gray-500 mt-2">
                    Search trains by destination
                    and timing.
                </p>

            </div>


            {/* SEARCH SECTION */}

            <div className="bg-white p-6 rounded-xl shadow border mb-8">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                    <input
                        type="text"
                        placeholder="Enter Source"
                        value={source}
                        onChange={(e) =>
                            setSource(
                                e.target.value
                            )
                        }
                        className="border p-3 rounded-lg"
                    />

                    <input
                        type="text"
                        placeholder="Enter Destination"
                        value={destination}
                        onChange={(e) =>
                            setDestination(
                                e.target.value
                            )
                        }
                        className="border p-3 rounded-lg"
                    />

                    <input
                        type="text"
                        placeholder="Departure Time"
                        value={departureTime}
                        onChange={(e) =>
                            setDepartureTime(
                                e.target.value
                            )
                        }
                        className="border p-3 rounded-lg"
                    />

                </div>

                <button
                    onClick={searchTrains}
                    className="mt-5 bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-lg"
                >
                    Search Trains
                </button>

            </div>


            {/* AVAILABLE TRAINS */}

            <div className="bg-white p-6 rounded-xl shadow border">

                <h2 className="text-2xl font-bold mb-6">
                    Available Trains
                </h2>

                <div className="overflow-auto max-h-[500px]">

                    <table className="w-full text-left border-collapse">

                        <thead>

                            <tr className="bg-gray-100">

                                <th className="p-3 sticky top-0 bg-gray-100 z-10">
                                    Train
                                </th>

                                <th className="p-3 sticky top-0 bg-gray-100 z-10">
                                    Source
                                </th>

                                <th className="p-3 sticky top-0 bg-gray-100 z-10">
                                    Destination
                                </th>

                                <th className="p-3 sticky top-0 bg-gray-100 z-10">
                                    Departure
                                </th>

                                <th className="p-3 sticky top-0 bg-gray-100 z-10">
                                    Available Seats
                                </th>

                                <th className="p-3 sticky top-0 bg-gray-100 z-10">
                                    Ticket Price
                                </th>

                                <th className="p-3 sticky top-0 bg-gray-100 z-10">
                                    Action
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredTrains.map(
                                (train) => (

                                    <tr
                                        key={train._id}
                                        className="border-b hover:bg-gray-50"
                                    >

                                        <td className="p-3 font-semibold">
                                            {
                                                train.trainName
                                            }
                                        </td>

                                        <td className="p-3">
                                            {
                                                train.source
                                            }
                                        </td>

                                        <td className="p-3">
                                            {
                                                train.destination
                                            }
                                        </td>

                                        <td className="p-3">
                                            {
                                                train.departureTime
                                            }
                                        </td>

                                        <td className="p-3">
                                            <div className="font-semibold text-gray-800">
                                                {train.seats}
                                            </div>
                                            <div className="text-[10px] text-gray-500 mt-0.5 animate-pulse">
                                                {train.availableSeats !== undefined ? train.availableSeats : (train.totalCoaches * 18)}S / {train.availableBerths !== undefined ? train.availableBerths : (train.totalCoaches * 60)}B Available
                                            </div>
                                        </td>

                                        <td className="p-3 text-green-700 font-bold">
                                            Rs. {
                                                train.ticketPrice
                                            }
                                        </td>

                                        <td className="p-3">

                                            <button
                                                onClick={() =>
                                                    openBookingModal(
                                                        train
                                                    )
                                                }
                                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                                            >
                                                Book Ticket
                                            </button>

                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* BOOKING MODAL */}

            {selectedTrain && (

                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[20000] px-4 py-8">

                    <div
                        className="
                        bg-white
                        rounded-3xl
                        shadow-[0_25px_80px_rgba(0,0,0,0.25)]
                        border-4 border-blue-100
                        w-full
                        max-w-6xl
                        h-[90vh]
                        relative
                        overflow-hidden
                    "
                    >
                        {/* Header Section */}
                        <div 
                            className="relative z-50 px-8 py-5 border-b shadow-lg"
                            style={{ background: 'linear-gradient(to right, #1e3a8a, #1d4ed8)' }}
                        >
                            <h2 className="text-3xl font-bold" style={{ color: '#ffffff' }}>
                                Railway Ticket Booking
                            </h2>
                            <p className="mt-1 font-medium" style={{ color: '#dbeafe' }}>
                                Fill passenger details and select your seats
                            </p>
                        </div>

                        {/* CLOSE BUTTON */}
                        <button
                            onClick={closeModal}
                            className="
                            absolute
                            top-5
                            right-5
                            z-[100]
                            bg-red-500
                            hover:bg-red-600
                            text-white
                            w-12
                            h-12
                            rounded-full
                            shadow-xl
                            flex
                            items-center
                            justify-center
                            text-2xl
                            transition-all
                            duration-200
                            hover:scale-110
                            "
                        >
                            ✕
                        </button>

                        {/* Scrollable Content Wrapper */}
                        <div className="h-[calc(90vh-90px)] overflow-y-auto p-8">

                            {/* FIRST STEP */}

                            {!showPaymentModal && (

                                <>

                                    <h2 className="text-3xl font-bold mb-6 text-blue-900">
                                        Confirm Booking
                                    </h2>

                                    <div className="space-y-4 mb-6">
                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-1">Full Name *</label>
                                            <input
                                                type="text"
                                                placeholder="Enter Full Name"
                                                value={passengerName}
                                                onChange={(e) =>
                                                    setPassengerName(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full border-2 border-gray-300 rounded-xl px-5 py-4 text-lg focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-1">CNIC (13 Digits) *</label>
                                            <input
                                                type="text"
                                                placeholder="Enter 13 Digit CNIC"
                                                value={cnic}
                                                onChange={(e) =>
                                                    setCnic(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full border-2 border-gray-300 rounded-xl px-5 py-4 text-lg focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2">Coach Selection *</label>
                                            <div className="flex flex-wrap gap-2">
                                                {(selectedTrain?.coaches || []).map((coach) => {
                                                    const cNum = coach.coachNumber;
                                                    return (
                                                        <button
                                                            key={cNum}
                                                            type="button"
                                                            onClick={() => {
                                                                setCoachNumber(cNum);
                                                            }}
                                                            className={`px-6 py-3 rounded-xl font-bold transition-all ${
                                                                coachNumber === cNum
                                                                    ? "bg-blue-800 text-white shadow-lg"
                                                                    : "bg-gray-100 hover:bg-blue-50 border"
                                                            }`}
                                                        >
                                                            {cNum}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    {coachNumber && (
                                        <div className="mb-6">
                                            <label className="block text-gray-700 font-semibold mb-3">
                                                Select Seats (Coach {coachNumber}) *
                                            </label>
                                            <SeatMap
                                                coachSeats={selectedTrain?.coaches?.find(
                                                    (c) => c.coachNumber === coachNumber
                                                )?.seats || []}
                                                selectedSeats={selectedSeats.filter(s => s.coach === coachNumber).map(s => s.number)}
                                                onSeatClick={(seatNo) => {
                                                    const isAlreadySelected = selectedSeats.some(
                                                        (s) => s.coach === coachNumber && s.number === seatNo
                                                    );
                                                    if (isAlreadySelected) {
                                                        setSelectedSeats(
                                                            selectedSeats.filter(
                                                                (s) => !(s.coach === coachNumber && s.number === seatNo)
                                                            )
                                                        );
                                                    } else {
                                                        if (selectedSeats.length >= 8) {
                                                            alert("Maximum 8 seats allowed");
                                                            return;
                                                        }
                                                        const seatType = seatNo.endsWith("S") ? "seat" : "berth";
                                                        setSelectedSeats([
                                                            ...selectedSeats,
                                                            { coach: coachNumber, type: seatType, number: seatNo }
                                                        ]);
                                                    }
                                                }}
                                                ticketPrice={selectedTrain.ticketPrice}
                                            />
                                        </div>
                                    )}

                                    {selectedSeats.length > 0 && (
                                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-6 space-y-1">
                                            <p className="text-blue-900">
                                                <strong>Selected Seats:</strong>{" "}
                                                {selectedSeats.map(s => `${s.coach}-${s.number}`).join(", ")}
                                            </p>
                                            <p className="text-blue-900">
                                                <strong>Number of Seats:</strong>{" "}
                                                {selectedSeats.length}
                                            </p>
                                            <p className="text-blue-900 font-bold text-lg">
                                                <strong>Total Fare:</strong> Rs.{" "}
                                                {selectedSeats.length * selectedTrain.ticketPrice}
                                            </p>
                                        </div>
                                    )}

                                    <button
                                        onClick={generatePayment}
                                        className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-lg w-full font-semibold transition-colors shadow-md mt-4"
                                    >
                                        Book Ticket
                                    </button>

                                </>

                            )}


                            {/* PAYMENT CHALLAN */}

                            {showPaymentModal && (

                                <>

                                    <h2 className="text-3xl font-bold mb-6 text-green-700">
                                        Payment Challan
                                    </h2>

                                    <div className="bg-gray-100 p-6 rounded-xl space-y-4">

                                        <p>
                                            <strong>
                                                Full Name:
                                            </strong>
                                            {" "}
                                            {passengerName}
                                        </p>

                                        <p>
                                            <strong>
                                                CNIC:
                                            </strong>
                                            {" "}
                                            {cnic}
                                        </p>

                                        <p>
                                            <strong>
                                                Train:
                                            </strong>
                                            {" "}
                                            {
                                                selectedTrain.trainName
                                            }
                                        </p>

                                        <p>
                                            <strong>
                                                Route:
                                            </strong>
                                            {" "}
                                            {
                                                selectedTrain.source
                                            }
                                            {" → "}
                                            {
                                                selectedTrain.destination
                                            }
                                        </p>

                                        <p>
                                            <strong>
                                                Coach:
                                            </strong>{" "}
                                            {[...new Set(selectedSeats.map(s => s.coach))].sort().join(", ")}
                                        </p>

                                        <p>
                                            <strong>
                                                Seats:
                                            </strong>{" "}
                                            {selectedSeats.map(s => `${s.coach}-${s.number}`).join(", ")}
                                        </p>

                                        <p>
                                            <strong>
                                                Number of Seats:
                                            </strong>
                                            {" "}
                                            {selectedSeats.length}
                                        </p>

                                        <p>
                                            <strong>
                                                Price Per Seat:
                                            </strong>{" "}
                                            Rs. {selectedTrain.ticketPrice}
                                        </p>

                                        <p className="text-green-700 font-bold text-lg">
                                            Total Fare:
                                            {" "}
                                            Rs.
                                            {" "}
                                            {
                                                selectedSeats.length * selectedTrain.ticketPrice
                                            }
                                        </p>

                                        <p className="text-red-600 font-bold">
                                            Payment ID:
                                            {" "}
                                            {paymentId}
                                        </p>

                                    </div>

                                    <div className="flex gap-4 mt-6">

                                        <button
                                            onClick={downloadChallan}
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg flex-1 font-semibold transition-colors shadow"
                                        >
                                            Download Challan
                                        </button>

                                        <button
                                            onClick={handleBooking}
                                            className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg flex-1 font-semibold transition-colors shadow"
                                        >
                                            Confirm Seat
                                        </button>

                                    </div>

                                </>

                            )}

                        </div>

                    </div>

                </div>

            )}

        </DashboardLayout>
    );
};

export default BookTicket;