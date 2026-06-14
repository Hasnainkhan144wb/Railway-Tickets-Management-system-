import {
    useEffect,
    useState,
} from "react";

import { useLocation } from "react-router-dom";

import axios from "axios";

import DashboardLayout from "../../components/DashboardLayout";

import jsPDF from "jspdf";
import QRCode from "qrcode";

import {
    FaTimes,
} from "react-icons/fa";

import SeatMap from "../../components/SeatMap";


const BookTicket = () => {
    const location = useLocation();
    const [coachNumber, setCoachNumber] = useState("");
    const [trains, setTrains] = useState([]);
    const [filteredTrains, setFilteredTrains] = useState([]);
    const [selectedTrain, setSelectedTrain] = useState(null);
    const [seatsBooked, setSeatsBooked] = useState(1);
    const [passengerName, setPassengerName] = useState("");
    const [cnic, setCnic] = useState("");
    const [phone, setPhone] = useState("");
    const [paymentId, setPaymentId] = useState("");
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedSeats, setSelectedSeats] = useState([]);

    // NEW ADVANCED STATES
    const [travelDate, setTravelDate] = useState(new Date().toISOString().split('T')[0]);
    const [sortBy, setSortBy] = useState("");
    const [promoCode, setPromoCode] = useState("");
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const [promoError, setPromoError] = useState("");
    const [promoSuccess, setPromoSuccess] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("challan");
    const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvc: "" });
    const [walletPhone, setWalletPhone] = useState("");
    const [otpGenerated, setOtpGenerated] = useState("");
    const [otpInput, setOtpInput] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [otpError, setOtpError] = useState("");
    const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
    const [showChallanSuccessModal, setShowChallanSuccessModal] = useState(false);
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes session
    const [showTimeoutModal, setShowTimeoutModal] = useState(false);

    // SEARCH STATES
    const [source, setSource] = useState("");
    const [destination, setDestination] = useState("");
    const [departureTime, setDepartureTime] = useState("");

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
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

    useEffect(() => {
        if (location.state && trains.length > 0) {
            const src = location.state.source || "";
            const dest = location.state.destination || "";
            const date = location.state.travelDate || "";
            setSource(src);
            setDestination(dest);
            if (date) setTravelDate(date);

            const filtered = trains.filter((train) => {
                const matchSource = src.trim() ? train.source.toLowerCase().includes(src.trim().toLowerCase()) : true;
                const matchDest = dest.trim() ? train.destination.toLowerCase().includes(dest.trim().toLowerCase()) : true;
                const matchDate = date ? train.travelDate === date : true;
                return matchSource && matchDest && matchDate;
            });
            setFilteredTrains(filtered);
        }
    }, [location.state, trains]);


    // TIMER COUNTDOWN EFFECT
    useEffect(() => {
        let timer;
        if (selectedTrain && !isBookingConfirmed && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (selectedTrain && !isBookingConfirmed && timeLeft === 0) {
            alert("Booking session expired! Please select your seats again.");
            closeModal();
        }
        return () => clearInterval(timer);
    }, [selectedTrain, isBookingConfirmed, timeLeft]);

    // SEARCH TRAINS
    const searchTrains = () => {
        const filtered = trains.filter((train) => {
            const matchSource = source.trim()
                ? train.source.toLowerCase().includes(source.trim().toLowerCase())
                : true;
            const matchDest = destination.trim()
                ? train.destination.toLowerCase().includes(destination.trim().toLowerCase())
                : true;
            const matchDate = travelDate
                ? train.travelDate === travelDate
                : true;
            return matchSource && matchDest && matchDate;
        });
        setFilteredTrains(filtered);
    };


    // OPEN BOOKING MODAL
    const openBookingModal = (train) => {
        setSelectedTrain(train);
        setShowPaymentModal(false);
        setCoachNumber(train.coaches?.[0]?.coachNumber || "C1");
        setSelectedSeats([]);
        setTimeLeft(600); // 10 minutes
        setIsBookingConfirmed(false);
    };

    // CLOSE MODAL
    const closeModal = () => {
        setSelectedTrain(null);
        setPassengerName("");
        setCnic("");
        setPhone("");
        setSeatsBooked(1);
        setCoachNumber("");
        setSelectedSeats([]);
        setShowPaymentModal(false);
        setPromoCode("");
        setDiscountPercentage(0);
        setPromoError("");
        setPromoSuccess("");
        setPaymentMethod("challan");
        setCardDetails({ number: "", expiry: "", cvc: "" });
        setWalletPhone("");
        setOtpGenerated("");
        setOtpInput("");
        setOtpSent(false);
        setIsOtpVerified(false);
        setOtpError("");
        setIsBookingConfirmed(false);
        setShowChallanSuccessModal(false);
        setTimeLeft(600);
    };

    // PROMO CODE VERIFIER
    const applyPromoCode = () => {
        setPromoError("");
        setPromoSuccess("");
        if (!promoCode.trim()) {
            setPromoError("Please enter a promo code");
            return;
        }
        const code = promoCode.trim().toUpperCase();
        if (code === "RAIL30") {
            setDiscountPercentage(30);
            setPromoSuccess("Promo RAIL30 applied! 30% discount deducted from fare.");
        } else if (code === "SAVE10") {
            setDiscountPercentage(10);
            setPromoSuccess("Promo SAVE10 applied! 10% discount deducted from fare.");
        } else {
            setPromoError("Invalid code. Try RAIL30 or SAVE10.");
            setDiscountPercentage(0);
        }
    };

    const generatePayment = () => {
        if (passengerName.trim() === "") {
            return alert("Please enter passenger full name");
        }

        const nameRegex = /^[A-Za-z\s]+$/;
        if (!nameRegex.test(passengerName)) {
            return alert("Full Name must only contain letters and spaces");
        }

        if (!cnic || cnic.trim().length !== 13 || !/^\d{13}$/.test(cnic)) {
            return alert("CNIC must be exactly 13 digits (no dashes)");
        }

        if (!phone || phone.trim().length !== 11 || !/^\d{11}$/.test(phone.trim())) {
            return alert("Phone Number must be exactly 11 digits");
        }

        if (selectedSeats.length === 0) {
            return alert("Please select at least 1 seat/berth from the layout");
        }

        if (selectedSeats.length > 8) {
            return alert("Maximum of 8 seats allowed per booking");
        }

        // RANDOM 8 DIGIT PAYMENT ID
        const randomId = Math.floor(10000000 + Math.random() * 90000000);
        setPaymentId(randomId);
        setShowPaymentModal(true);
    };


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

    // PDF TICKET GENERATOR
    const downloadTicketPDF = async () => {
        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4"
        });
        const basePrice = selectedSeats.length * selectedTrain.ticketPrice;
        const fee = Math.round(basePrice * 0.05);
        const disc = Math.round(basePrice * (discountPercentage / 100));
        const total = basePrice + fee - disc;

        const uniqueCoaches = [...new Set(selectedSeats.map(s => s.coach))].sort().join(", ");
        const formattedSeats = selectedSeats.map(s => `${s.coach}-${s.number}`).join(", ");
        const travelDateFormatted = formatDateStr(travelDate || selectedTrain.travelDate);
        const arrivalTimeComputed = calculateArrival(selectedTrain.departureTime);
        const paymentMethodDisplay = getPaymentMethodDisplay(paymentMethod);

        // QR Code plain text content
        const qrText = `Passenger: ${passengerName}
CNIC: ${cnic}
Mobile: ${phone}
Train: ${selectedTrain.trainName}
From: ${selectedTrain.source}
To: ${selectedTrain.destination}
Date: ${travelDateFormatted}
Departure: ${selectedTrain.departureTime}
Arrival: ${arrivalTimeComputed}
Coach: ${uniqueCoaches}
Seat: ${formattedSeats}
Payment ID: ${paymentId}
Status: Pending Verification`;

        let qrDataUrl = "";
        try {
            qrDataUrl = await QRCode.toDataURL(qrText, { margin: 1, width: 150 });
        } catch (err) {
            console.error("Failed to generate QR Code", err);
        }

        // Generate Text-based Layout
        doc.setFont("courier", "normal");
        doc.setFontSize(10);

        let y = 15;
        const addLine = (text) => {
            doc.text(text, 20, y);
            y += 6;
        };

        addLine("=============================================");
        addLine("          PAKISTAN RAILWAYS");
        addLine("          E-TICKET / Challan RECEIPT");
        addLine("=============================================");
        addLine("");
        addLine(`Passenger  : ${passengerName}`);
        addLine(`CNIC       : ${cnic}`);
        addLine(`Mobile     : ${phone}`);
        addLine(`Train      : ${selectedTrain.trainName}`);
        addLine(`From       : ${selectedTrain.source}`);
        addLine(`To         : ${selectedTrain.destination}`);
        addLine(`Date       : ${travelDateFormatted}`);
        addLine(`Departure  : ${selectedTrain.departureTime}`);
        addLine(`Arrival    : ${arrivalTimeComputed}`);
        addLine(`Coach      : ${uniqueCoaches}`);
        addLine(`Seat       : ${formattedSeats}`);
        addLine("");
        addLine("---------------------------------------------");
        addLine(`Fare             : Rs. ${basePrice - disc}`);
        addLine(`Service Charges  : Rs. ${fee}`);
        addLine(`Total Paid       : Rs. ${total}`);
        addLine("---------------------------------------------");
        addLine("");
        addLine(`Payment Method : ${paymentMethodDisplay}`);
        addLine(`Payment ID     : ${paymentId}`);
        addLine("");

        if (qrDataUrl) {
            doc.addImage(qrDataUrl, "PNG", 20, y, 35, 35);
            y += 40;
        }

        addLine("Thank you for choosing Pakistan Railways.");
        addLine("=============================================");

        doc.save(`railway-ticket-${paymentId}.pdf`);
    };

    // FINAL BOOKING
    const handleBooking = async () => {
        try {
            await axios.post(
                "http://localhost:5000/api/bookings",
                {
                    user: user.id,
                    train: selectedTrain._id,
                    seatsBooked: selectedSeats.length,
                    passengerName,
                    cnic,
                    phone,
                    paymentId,
                    paymentMethod,
                    coachNumber,
                    selectedSeats,
                    status: "Pending Verification",
                }
            );

            console.log(`Booking confirmed for passenger: ${passengerName}. Email dispatched to: ${user?.email || "user@test.com"}`);
            fetchTrains();
            setShowChallanSuccessModal(true);
        } catch (error) {
            alert(error.response?.data?.message || "Booking failed. Please try again.");
        }
    };


    const sortedTrains = [...filteredTrains].sort((a, b) => {
        if (sortBy === "price_asc") {
            return a.ticketPrice - b.ticketPrice;
        }
        if (sortBy === "price_desc") {
            return b.ticketPrice - a.ticketPrice;
        }
        if (sortBy === "seats") {
            const getSeatsCount = (t) => {
                let count = 0;
                t.coaches?.forEach((coach) => {
                    coach.seats?.forEach((seat) => {
                        if (!seat.booked) count++;
                    });
                });
                return count;
            };
            return getSeatsCount(b) - getSeatsCount(a);
        }
        if (sortBy === "time") {
            return a.departureTime.localeCompare(b.departureTime);
        }
        return 0;
    });

    return (

        <DashboardLayout>

            {/* HEADER */}

            <div className="mb-8">

                <h1 className="text-4xl font-bold text-gray-800">
                    Search & Book Trains
                </h1>

                <p className="text-gray-500 mt-2">
                    Search trains, select your coach, choose seats in real-time, and download your ticket immediately.
                </p>

            </div>


            {/* SEARCH SECTION */}

            <div className="bg-white p-6 rounded-xl shadow border mb-8 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="flex flex-col">
                        <label className="text-xs font-bold text-gray-500 mb-1">From Station</label>
                        <input
                            type="text"
                            placeholder="e.g. Lahore"
                            value={source}
                            onChange={(e) => setSource(e.target.value)}
                            className="border p-3 rounded-lg w-full"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xs font-bold text-gray-500 mb-1">To Station</label>
                        <input
                            type="text"
                            placeholder="e.g. Karachi"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            className="border p-3 rounded-lg w-full"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xs font-bold text-gray-500 mb-1">Travel Date</label>
                        <input
                            type="date"
                            value={travelDate}
                            onChange={(e) => setTravelDate(e.target.value)}
                            className="border p-3 rounded-lg w-full"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-semibold text-gray-655">Sort Results By:</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="border p-2 rounded-lg bg-white text-sm"
                        >
                            <option value="">Default (No Sorting)</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                            <option value="seats">Seats Available</option>
                            <option value="time">Departure Time</option>
                        </select>
                    </div>

                    <button
                        onClick={searchTrains}
                        className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-bold transition-all shadow"
                    >
                        Search Trains
                    </button>
                </div>
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
                                    Travel Date
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

                            {sortedTrains.map(
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
                                                train.travelDate ? new Date(train.travelDate).toLocaleDateString('en-GB') : '—'
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

                    {sortedTrains.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-400 text-lg font-semibold">No Trains Available</p>
                            <p className="text-gray-400 text-sm mt-1">Try changing your search filters or selecting a different date.</p>
                        </div>
                    )}

                </div>

            </div>


            {/* BOOKING MODAL */}

            {selectedTrain && (

                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[20000] px-4 py-8 animate-fadeIn">

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
                            className="relative z-50 px-8 py-5 border-b shadow-lg flex items-center justify-between"
                            style={{ background: 'linear-gradient(to right, #1e3a8a, #1d4ed8)' }}
                        >
                            <div>
                                <h2 className="text-3xl font-bold text-white">
                                    Railway Ticket Booking
                                </h2>
                                <p className="mt-1 font-medium text-blue-100">
                                    Select seats, choose payment option, and download E-Ticket
                                </p>
                            </div>
                            {!isBookingConfirmed && (
                                <div className="bg-red-650/80 border border-red-500 text-white font-mono px-4 py-2 rounded-xl flex items-center gap-2 mr-16">
                                    <span className="animate-pulse font-bold text-red-300">●</span>
                                    <span>Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60 < 10 ? "0" : "") + (timeLeft % 60)}</span>
                                </div>
                            )}
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
                        <div className="h-[calc(90vh-90px)] overflow-y-auto p-8 bg-gray-50/30">

                            {isBookingConfirmed ? (
                                <div className="flex flex-col items-center justify-center py-6 text-center animate-fadeIn">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600 animate-bounce">
                                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-3xl font-extrabold text-gray-800">Booking Confirmed!</h3>
                                    <p className="text-gray-500 mt-2 max-w-md">
                                        Your seat reservation is successful. A confirmation email has been dispatched to <strong className="text-blue-900">{user?.email || "your registered email"}</strong>.
                                    </p>

                                    {/* TICKET RECEIPT */}
                                    <div className="mt-8 bg-white border-2 border-dashed border-gray-200 rounded-2xl p-6 text-left w-full max-w-lg shadow-sm relative overflow-hidden">
                                        {/* Notch cuts */}
                                        <div className="absolute top-1/2 -left-3 w-6 h-6 bg-gray-50 rounded-full border-r-2 border-dashed border-gray-200"></div>
                                        <div className="absolute top-1/2 -right-3 w-6 h-6 bg-gray-50 rounded-full border-l-2 border-dashed border-gray-200"></div>

                                        <div className="flex justify-between items-center border-b pb-4 mb-4">
                                            <div>
                                                <span className="text-[10px] uppercase font-bold text-gray-400">Boarding Pass</span>
                                                <h4 className="text-xl font-bold text-blue-900">{selectedTrain.trainName}</h4>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[10px] uppercase font-bold text-gray-400">Payment ID</span>
                                                <p className="text-sm font-mono font-bold text-red-600">{paymentId}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                                            <div>
                                                <span className="text-xs text-gray-400 block">Passenger Name</span>
                                                <strong className="text-gray-700">{passengerName}</strong>
                                            </div>
                                            <div>
                                                <span className="text-xs text-gray-400 block">CNIC</span>
                                                <strong className="text-gray-700">{cnic}</strong>
                                            </div>
                                            <div>
                                                <span className="text-xs text-gray-400 block">Route</span>
                                                <strong className="text-gray-700">{selectedTrain.source} → {selectedTrain.destination}</strong>
                                            </div>
                                            <div>
                                                <span className="text-xs text-gray-400 block">Coach / Class</span>
                                                <strong className="text-gray-700">Coach {coachNumber}</strong>
                                            </div>
                                        </div>

                                        <div className="border-t pt-4 space-y-2 text-sm">
                                            <div className="flex justify-between text-gray-500">
                                                <span>Selected Seats ({selectedSeats.length})</span>
                                                <span className="font-mono text-gray-700">{selectedSeats.map(s => `${s.coach}-${s.number}`).join(", ")}</span>
                                            </div>
                                            <div className="flex justify-between text-gray-500">
                                                <span>Base Fare</span>
                                                <span>Rs. {selectedSeats.length * selectedTrain.ticketPrice}</span>
                                            </div>
                                            <div className="flex justify-between text-gray-500">
                                                <span>Service Fee (5%)</span>
                                                <span>Rs. {Math.round(selectedSeats.length * selectedTrain.ticketPrice * 0.05)}</span>
                                            </div>
                                            {discountPercentage > 0 && (
                                                <div className="flex justify-between text-green-600 font-medium">
                                                    <span>Discount ({discountPercentage}%)</span>
                                                    <span>-Rs. {Math.round(selectedSeats.length * selectedTrain.ticketPrice * (discountPercentage / 100))}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between text-lg font-bold border-t pt-2 text-green-700">
                                                <span>Total Paid ({paymentMethod.toUpperCase()})</span>
                                                <span>Rs. {
                                                    (selectedSeats.length * selectedTrain.ticketPrice) +
                                                    Math.round(selectedSeats.length * selectedTrain.ticketPrice * 0.05) -
                                                    Math.round(selectedSeats.length * selectedTrain.ticketPrice * (discountPercentage / 100))
                                                }</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 mt-8 w-full max-w-lg">
                                        <button
                                            onClick={downloadTicketPDF}
                                            className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-xl flex-1 font-semibold transition-all shadow-md flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                            Download E-Ticket
                                        </button>
                                        <button
                                            onClick={closeModal}
                                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl flex-1 font-semibold transition-all"
                                        >
                                            Close Window
                                        </button>
                                    </div>
                                </div>
                            ) : showPaymentModal ? (
                                <>
                                    <div className="flex items-center gap-2 mb-6">
                                        <button
                                            onClick={() => setShowPaymentModal(false)}
                                            className="text-blue-900 hover:text-blue-800 flex items-center gap-1 font-semibold text-sm bg-blue-50 px-3 py-2 rounded-lg"
                                        >
                                            ← Edit Seats
                                        </button>
                                        <h2 className="text-3xl font-extrabold text-blue-900">Checkout & Payment</h2>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {/* Left Side: Promo & Payment Select */}
                                        <div className="space-y-6">

                                            {/* PAYMENT METHOD SELECTOR */}
                                            <div className="bg-white p-6 rounded-2xl border space-y-4">
                                                <h4 className="font-bold text-gray-700">Choose Payment Method</h4>
                                                <div className="grid grid-cols-3 gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => setPaymentMethod("challan")}
                                                        className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === "challan"
                                                                ? "border-blue-900 bg-blue-50 text-blue-900 font-bold"
                                                                : "border-gray-250 hover:border-blue-200 bg-white text-gray-500"
                                                            }`}
                                                    >
                                                        <span className="text-2xl">📝</span>
                                                        <span className="text-xs">Challan</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setPaymentMethod("card")}
                                                        className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === "card"
                                                                ? "border-blue-900 bg-blue-50 text-blue-900 font-bold"
                                                                : "border-gray-250 hover:border-blue-200 bg-white text-gray-500"
                                                            }`}
                                                    >
                                                        <span className="text-2xl">💳</span>
                                                        <span className="text-xs">Card (Stripe)</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setPaymentMethod("wallet")}
                                                        className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === "wallet"
                                                                ? "border-blue-900 bg-blue-50 text-blue-900 font-bold"
                                                                : "border-gray-250 hover:border-blue-200 bg-white text-gray-500"
                                                            }`}
                                                    >
                                                        <span className="text-2xl">📱</span>
                                                        <span className="text-xs">Wallet</span>
                                                    </button>
                                                </div>

                                                {/* MOCK CREDIT CARD FORM */}
                                                {paymentMethod === "card" && (
                                                    <div className="space-y-3 p-4 bg-white rounded-xl border border-blue-100 animate-fadeIn">
                                                        <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Credit Card Information</h5>
                                                        <div>
                                                            <label className="text-[10px] text-gray-500 block mb-0.5">Card Number</label>
                                                            <input
                                                                type="text"
                                                                placeholder="4000 1234 5678 9010"
                                                                value={cardDetails.number}
                                                                onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                                                                className="border p-2 rounded-lg text-sm w-full"
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div>
                                                                <label className="text-[10px] text-gray-500 block mb-0.5">Expiry Date</label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="MM/YY"
                                                                    value={cardDetails.expiry}
                                                                    onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                                                    className="border p-2 rounded-lg text-sm w-full text-center"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-[10px] text-gray-500 block mb-0.5">CVV</label>
                                                                <input
                                                                    type="password"
                                                                    placeholder="***"
                                                                    maxLength="3"
                                                                    value={cardDetails.cvc}
                                                                    onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                                                                    className="border p-2 rounded-lg text-sm w-full text-center"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* MOCK MOBILE WALLET */}
                                                {paymentMethod === "wallet" && (
                                                    <div className="space-y-4 p-4 bg-white rounded-xl border border-blue-100 animate-fadeIn">
                                                        <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mobile Account Details</h5>
                                                        <div>
                                                            <label className="text-[10px] text-gray-500 block mb-0.5 font-semibold">Mobile Account Number (11 Digits)</label>
                                                            <input
                                                                type="text"
                                                                placeholder="e.g. 03001234567"
                                                                value={walletPhone}
                                                                onChange={(e) => {
                                                                    setWalletPhone(e.target.value);
                                                                    setOtpSent(false);
                                                                    setIsOtpVerified(false);
                                                                    setOtpGenerated("");
                                                                    setOtpInput("");
                                                                    setOtpError("");
                                                                }}
                                                                disabled={isOtpVerified}
                                                                className="border p-2.5 rounded-lg text-sm w-full font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            />
                                                        </div>

                                                        {!otpSent && !isOtpVerified && (
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    if (!walletPhone || walletPhone.trim().length !== 11 || !/^\d{11}$/.test(walletPhone.trim())) {
                                                                        alert("Mobile Account Number must be exactly 11 digits.");
                                                                        return;
                                                                    }
                                                                    const code = Math.floor(1000 + Math.random() * 9000).toString();
                                                                    setOtpGenerated(code);
                                                                    setOtpSent(true);
                                                                    setOtpError("");
                                                                    alert(`OTP verification code [${code}] sent to ${walletPhone}.`);
                                                                }}
                                                                className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg text-xs transition-all"
                                                            >
                                                                Generate OTP
                                                            </button>
                                                        )}

                                                        {otpSent && !isOtpVerified && (
                                                            <div className="space-y-3 pt-2 border-t border-gray-100 animate-fadeIn">
                                                                <div>
                                                                    <label className="text-[10px] text-gray-550 block mb-0.5 font-semibold">Enter 4-Digit OTP</label>
                                                                    <input
                                                                        type="text"
                                                                        maxLength="4"
                                                                        placeholder="e.g. 1234"
                                                                        value={otpInput}
                                                                        onChange={(e) => setOtpInput(e.target.value)}
                                                                        className="border p-2.5 rounded-lg text-sm w-full text-center font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                    />
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        if (otpInput === otpGenerated) {
                                                                            setIsOtpVerified(true);
                                                                            setOtpError("");
                                                                        } else {
                                                                            setOtpError("Invalid OTP, please try again.");
                                                                        }
                                                                    }}
                                                                    className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-lg text-xs transition-all"
                                                                >
                                                                    Confirm OTP
                                                                </button>
                                                                {otpError && (
                                                                    <p className="text-[11px] text-red-500 font-semibold text-center">{otpError}</p>
                                                                )}
                                                            </div>
                                                        )}

                                                        {isOtpVerified && (
                                                            <div className="bg-green-50 border border-green-200 text-green-750 p-2.5 rounded-xl text-center text-xs font-bold animate-fadeIn">
                                                                ✓ Mobile Account Verified Successfully
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {paymentMethod === "challan" && (
                                                    <div className="p-3 bg-blue-50 text-blue-900 rounded-xl border border-blue-100 text-xs leading-relaxed">
                                                        💡 You can print this challan voucher and pay at any partner railway booth or commercial bank desk.
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right Side: Fare breakdown & Submit */}
                                        <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">Fare Details</h3>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between text-sm text-gray-500">
                                                        <span>Base Fare ({selectedSeats.length} Seats)</span>
                                                        <span className="font-semibold text-gray-700">Rs. {selectedSeats.length * selectedTrain.ticketPrice}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm text-gray-500">
                                                        <span>Service Tax & Fees (5%)</span>
                                                        <span className="font-semibold text-gray-700">Rs. {Math.round(selectedSeats.length * selectedTrain.ticketPrice * 0.05)}</span>
                                                    </div>
                                                    {discountPercentage > 0 && (
                                                        <div className="flex justify-between text-sm text-green-600 font-semibold">
                                                            <span>Discount Applied ({discountPercentage}%)</span>
                                                            <span>-Rs. {Math.round(selectedSeats.length * selectedTrain.ticketPrice * (discountPercentage / 100))}</span>
                                                        </div>
                                                    )}
                                                    <div className="border-t pt-3 flex justify-between items-center text-lg font-bold text-gray-800">
                                                        <span>Total Amount</span>
                                                        <span className="text-2xl text-green-700">Rs. {
                                                            (selectedSeats.length * selectedTrain.ticketPrice) +
                                                            Math.round(selectedSeats.length * selectedTrain.ticketPrice * 0.05) -
                                                            Math.round(selectedSeats.length * selectedTrain.ticketPrice * (discountPercentage / 100))
                                                        }</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-3 mt-8">
                                                {paymentMethod === "challan" && (
                                                    <button
                                                        onClick={downloadTicketPDF}
                                                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded-xl w-full text-center transition-all shadow-md flex items-center justify-center gap-2"
                                                    >
                                                        📥 Download Challan PDF
                                                    </button>
                                                )}
                                                <button
                                                    onClick={handleBooking}
                                                    disabled={
                                                        paymentMethod === "card"
                                                            ? (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvc)
                                                            : paymentMethod === "wallet"
                                                                ? !isOtpVerified
                                                                : false
                                                    }
                                                    className={`font-bold py-4 px-4 rounded-xl w-full transition-all shadow-md flex items-center justify-center gap-2 text-lg ${(paymentMethod === "card" && (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvc)) ||
                                                            (paymentMethod === "wallet" && !isOtpVerified)
                                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50 shadow-none"
                                                            : "bg-green-700 hover:bg-green-800 text-white cursor-pointer"
                                                        }`}
                                                >
                                                    {paymentMethod === "challan" ? "Confirm Challan Booking" : "Authorize Payment & Book"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-3xl font-extrabold mb-6 text-blue-900">
                                        Confirm Passenger Details
                                    </h2>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {/* Passenger forms */}
                                        <div className="space-y-5">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
                                                <input
                                                    type="text"
                                                    placeholder="Enter Passenger Full Name"
                                                    value={passengerName}
                                                    onChange={(e) => setPassengerName(e.target.value)}
                                                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1">CNIC (13 Digits) *</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. 3520112345678"
                                                    value={cnic}
                                                    onChange={(e) => setCnic(e.target.value)}
                                                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 font-mono"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number (11 Digits) *</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. 03001234567"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 font-mono"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Coach Selection *</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {(selectedTrain?.coaches || []).map((coach) => {
                                                        const cNum = coach.coachNumber;
                                                        return (
                                                            <button
                                                                key={cNum}
                                                                type="button"
                                                                onClick={() => setCoachNumber(cNum)}
                                                                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all border ${coachNumber === cNum
                                                                        ? "bg-blue-900 text-white shadow"
                                                                        : "bg-white hover:bg-blue-50 border-gray-200 text-gray-600"
                                                                    }`}
                                                            >
                                                                {cNum}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Fare Breakdown Side Summary */}
                                        <div className="bg-blue-50/50 rounded-2xl border p-6 flex flex-col justify-between">
                                            <div>
                                                <h4 className="font-extrabold text-blue-900 mb-3 uppercase tracking-wider text-xs">Selection Summary</h4>
                                                <div className="space-y-2 text-sm text-gray-600">
                                                    <p><strong>Train:</strong> {selectedTrain.trainName}</p>
                                                    <p><strong>Route:</strong> {selectedTrain.source} → {selectedTrain.destination}</p>
                                                    <p><strong>Departure:</strong> {selectedTrain.departureTime}</p>
                                                    <p><strong>Price / Seat:</strong> Rs. {selectedTrain.ticketPrice}</p>
                                                </div>
                                            </div>

                                            {selectedSeats.length > 0 && (
                                                <div className="mt-4 pt-4 border-t border-blue-200 space-y-1">
                                                    <p className="text-sm text-blue-900">
                                                        <strong>Seats Selected:</strong>{" "}
                                                        {selectedSeats.map(s => `${s.coach}-${s.number}`).join(", ")}
                                                    </p>
                                                    <p className="text-lg font-bold text-blue-900">
                                                        Subtotal: Rs. {selectedSeats.length * selectedTrain.ticketPrice}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Seat Layout (Full width below form elements) */}
                                    {coachNumber && (
                                        <div className="mt-8 pt-6 border-t">
                                            <label className="block text-sm font-extrabold text-gray-700 mb-4 uppercase tracking-wider">
                                                Select Seats (Coach {coachNumber})
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

                                    <button
                                        onClick={generatePayment}
                                        className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-4 px-6 rounded-2xl w-full transition-all shadow-md mt-8 text-lg"
                                    >
                                        Proceed to Payment
                                    </button>
                                </>
                            )}

                        </div>

                    </div>

                </div>

            )}

            {showChallanSuccessModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[30000] animate-fadeIn">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-2 bg-yellow-500" />
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mb-6 text-yellow-600 border border-yellow-100">
                                <svg className="w-8 h-8 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>

                            <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                Booking Request Submitted
                            </h3>

                            <div className="text-gray-600 text-sm leading-relaxed space-y-4 mb-8">
                                <p>Your booking request has been received successfully.</p>
                                <p>Your ticket will be confirmed after staff verification.</p>
                                <p>Please wait for approval.</p>
                            </div>

                            <button
                                onClick={() => {
                                    setShowChallanSuccessModal(false);
                                    closeModal();
                                }}
                                className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md"
                            >
                                Got it
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </DashboardLayout>
    );
};

export default BookTicket;