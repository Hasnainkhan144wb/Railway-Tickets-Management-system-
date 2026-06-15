const Booking = require("../models/Booking");
const Train = require("../models/Train");
const Notification = require("../models/Notification");

// CREATE BOOKING

const createBooking = async (req, res) => {

    try {

        const {
            user,
            train,
            passengerName,
            cnic,
            phone,
            selectedSeats,
            coachNumber,
            status,
            paymentMethod,
        } = req.body;

        // VALIDATIONS

        if (!passengerName || passengerName.trim() === "") {
            return res.status(400).json({
                message: "Full Name is required",
            });
        }

        const nameRegex = /^[A-Za-z\s]+$/;
        if (!nameRegex.test(passengerName)) {
            return res.status(400).json({
                message: "Full Name must only contain letters and spaces",
            });
        }

        if (!cnic || cnic.trim().length !== 13 || !/^\d{13}$/.test(cnic)) {
            return res.status(400).json({
                message: "CNIC must be exactly 13 digits",
            });
        }

        if (!phone || phone.trim().length !== 11 || !/^\d{11}$/.test(phone.trim())) {
            return res.status(400).json({
                message: "Phone Number must be exactly 11 digits",
            });
        }

        if (!selectedSeats || !Array.isArray(selectedSeats) || selectedSeats.length === 0) {
            return res.status(400).json({
                message: "Please select at least one seat",
            });
        }

        if (selectedSeats.length > 8) {
            return res.status(400).json({
                message: "Maximum 8 seats allowed per booking",
            });
        }

        // FIND TRAIN

        const selectedTrain =
            await Train.findById(train);

        if (!selectedTrain) {

            return res.status(404).json({
                message: "Train not found",
            });
        }

        // CHECK SEATS AVAILABILITY (across multiple coaches)
        const unavailableSeats = [];
        const seatObjectsToBook = [];

        for (const seatItem of selectedSeats) {
            const cNumber = typeof seatItem === 'object' ? seatItem.coach : coachNumber;
            const sNum = typeof seatItem === 'object' ? seatItem.number : seatItem;

            const coach = selectedTrain.coaches.find(
                (c) => c.coachNumber === cNumber
            );

            if (!coach) {
                return res.status(400).json({
                    message: `Coach ${cNumber} not found`,
                });
            }

            const seat = coach.seats.find((s) => s.seatNumber === sNum);
            if (!seat) {
                return res.status(400).json({
                    message: `Seat ${sNum} not found in coach ${cNumber}`,
                });
            }

            if (seat.booked) {
                unavailableSeats.push(`${cNumber}-${sNum}`);
            } else {
                seatObjectsToBook.push({ coachObj: coach, seatObj: seat });
            }
        }

        if (unavailableSeats.length > 0) {
            return res.status(400).json({
                message: `Seats ${unavailableSeats.join(", ")} are already booked`,
            });
        }

        // BOOK SEATS
        let seatsCount = 0;
        let berthsCount = 0;
        for (const item of seatObjectsToBook) {
            item.seatObj.booked = true;
            if (item.seatObj.seatNumber.endsWith("S")) {
                seatsCount++;
            } else if (item.seatObj.seatNumber.endsWith("B")) {
                berthsCount++;
            }
        }

        // Update train available seats
        selectedTrain.seats = Math.max(0, selectedTrain.seats - selectedSeats.length);
        if (selectedTrain.availableSeats !== undefined) {
            selectedTrain.availableSeats = Math.max(0, selectedTrain.availableSeats - seatsCount);
        }
        if (selectedTrain.availableBerths !== undefined) {
            selectedTrain.availableBerths = Math.max(0, selectedTrain.availableBerths - berthsCount);
        }

        await selectedTrain.save();

        // GENERATE PAYMENT ID
        const paymentId =
            Math.floor(
                10000000 +
                Math.random() * 90000000
            ).toString();

        const seatsBooked = selectedSeats.length;
        const uniqueCoaches = [...new Set(selectedSeats.map(s => typeof s === 'object' ? s.coach : coachNumber))].sort();
        const coachNumberList = uniqueCoaches.join(", ");

        // CREATE BOOKING
        const booking =
            await Booking.create({
                user,
                train,
                passengerName,
                cnic,
                phone,
                seatsBooked,
                coachNumber: coachNumberList,
                selectedSeats,
                paymentId,
                paymentMethod,
                paymentStatus: "pending",
                verified: false,
                status: status || "confirmed",
            });

        try {
            await Notification.create({
                user: booking.user,
                title: "Ticket Booked Successfully",
                message: "Your ticket has been booked successfully.",
            });
        } catch (err) {
            console.error("Failed to create notification:", err);
        }

        res.status(201).json({

            message:
                "Ticket Booked Successfully",

            booking,
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
};


// DELETE BOOKING

const deleteBooking = async (
    req,
    res
) => {

    try {

        await Booking.findByIdAndDelete(
            req.params.id
        );

        res.json({
            message:
                "Booking Deleted Successfully",
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
};


// GET ALL BOOKINGS

const getBookings = async (
    req,
    res
) => {

    try {

        const bookings =
            await Booking.find()
                .populate("user")
                .populate("train")
                .sort({ createdAt: -1 });

        res.json(bookings);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
};


// GET USER BOOKINGS

const getUserBookings =
    async (req, res) => {

        try {

            const bookings =
                await Booking.find({
                    user:
                        req.params.userId,
                })
                    .populate("user")
                    .populate("train");

            res.json(bookings);

        } catch (error) {

            res.status(500).json({
                message:
                    error.message,
            });
        }
    };


// CANCEL BOOKING

const cancelBooking =
    async (req, res) => {

        try {

            const booking =
                await Booking.findById(
                    req.params.id
                );

            if (!booking) {

                return res.status(404).json({
                    message:
                        "Booking not found",
                });
            }

            if (booking.status === "cancelled") {
                return res.status(400).json({
                    message:
                        "Booking is already cancelled",
                });
            }

            booking.status =
                "cancelled";
            booking.cancelledAt = new Date();

            await booking.save();

            try {
                await Notification.create({
                    user: booking.user,
                    title: "Ticket Cancelled",
                    message: "Your booking has been cancelled successfully.",
                });
            } catch (err) {
                console.error("Failed to create notification:", err);
            }

            // Release seats in Train
            const selectedTrain = await Train.findById(booking.train);
            if (selectedTrain) {
                let seatsCount = 0;
                let berthsCount = 0;
                let seatsReleased = 0;

                if (booking.selectedSeats && booking.selectedSeats.length > 0) {
                    for (const seatItem of booking.selectedSeats) {
                        const cNumber = typeof seatItem === 'object' ? seatItem.coach : booking.coachNumber;
                        const sNum = typeof seatItem === 'object' ? seatItem.number : seatItem;

                        const coach = selectedTrain.coaches.find((c) => c.coachNumber === cNumber);
                        if (coach) {
                            const seat = coach.seats.find((s) => s.seatNumber === sNum);
                            if (seat && seat.booked) {
                                seat.booked = false;
                                seatsReleased++;
                                if (sNum.endsWith("S")) {
                                    seatsCount++;
                                } else if (sNum.endsWith("B")) {
                                    berthsCount++;
                                }
                            }
                        }
                    }
                } else if (booking.seatNumber) {
                    const coach = selectedTrain.coaches.find((c) => c.coachNumber === booking.coachNumber);
                    if (coach) {
                        const seat = coach.seats.find((s) => s.seatNumber === booking.seatNumber);
                        if (seat && seat.booked) {
                            seat.booked = false;
                            seatsReleased++;
                            if (booking.seatNumber.endsWith("S")) {
                                seatsCount++;
                            } else if (booking.seatNumber.endsWith("B")) {
                                berthsCount++;
                            }
                        }
                    }
                }

                selectedTrain.seats = Math.min(
                    selectedTrain.totalSeats,
                    selectedTrain.seats + seatsReleased
                );
                if (selectedTrain.availableSeats !== undefined) {
                    selectedTrain.availableSeats = Math.min(
                        selectedTrain.totalCoaches * 18,
                        selectedTrain.availableSeats + seatsCount
                    );
                }
                if (selectedTrain.availableBerths !== undefined) {
                    selectedTrain.availableBerths = Math.min(
                        selectedTrain.totalCoaches * 60,
                        selectedTrain.availableBerths + berthsCount
                    );
                }
                await selectedTrain.save();
            }

            res.json({
                message:
                    "Ticket Cancelled Successfully",
            });

        } catch (error) {

            res.status(500).json({
                message:
                    error.message,
            });
        }
    };


// VERIFY TICKET

const verifyTicket =
    async (req, res) => {

        try {

            const booking =
                await Booking.findById(
                    req.params.id
                );

            if (!booking) {

                return res.status(404).json({
                    message:
                        "Booking not found",
                });
            }

            if (booking.status === "cancelled") {
                return res.status(400).json({
                    message: "Cannot verify a cancelled ticket",
                });
            }

            if (
                booking.paymentStatus !==
                "paid"
            ) {

                return res.status(400).json({
                    message:
                        "Passenger payment is pending",
                });
            }

            booking.verified =
                true;
            booking.status =
                "confirmed";

            await booking.save();

            try {
                await Notification.create({
                    user: booking.user,
                    title: "Ticket Verified",
                    message: "Your ticket has been verified by railway staff.",
                });
            } catch (err) {
                console.error("Failed to create notification:", err);
            }

            res.json({
                message:
                    "Ticket Verified Successfully",
            });

        } catch (error) {

            res.status(500).json({
                message:
                    error.message,
            });
        }
    };


// UPDATE PAYMENT STATUS

const updatePaymentStatus =
    async (req, res) => {

        try {

            const booking =
                await Booking.findById(
                    req.params.id
                );

            if (!booking) {

                return res.status(404).json({
                    message:
                        "Booking not found",
                });
            }

            booking.paymentStatus =
                "paid";

            await booking.save();

            try {
                await Notification.create({
                    user: booking.user,
                    title: "Payment Received",
                    message: "Your payment has been received successfully.",
                });
            } catch (err) {
                console.error("Failed to create notification:", err);
            }

            res.json({
                message:
                    "Payment Completed Successfully",
            });

        } catch (error) {

            res.status(500).json({
                message:
                    error.message,
            });
        }
    };


// GET USER BOOKING STATS

const getUserBookingStats = async (req, res) => {
    try {
        const { userId } = req.params;

        const bookings = await Booking.find({ user: userId }).populate("train");

        const confirmedBookings = bookings.filter(b => b.status === "confirmed");
        const totalBookings = bookings.length;

        const parseTime = (timeStr) => {
            if (!timeStr) return { hours: 0, minutes: 0 };
            const cleaned = timeStr.toLowerCase().trim();
            let hours = 0;
            let minutes = 0;

            const match = cleaned.match(/(\d+)(?::(\d+))?\s*(am|pm)?/);
            if (match) {
                hours = parseInt(match[1], 10);
                minutes = match[2] ? parseInt(match[2], 10) : 0;
                const ampm = match[3];
                if (ampm === "pm" && hours < 12) {
                    hours += 12;
                } else if (ampm === "am" && hours === 12) {
                    hours = 0;
                }
            }
            return { hours, minutes };
        };

        const now = new Date();

        const upcomingTrips = confirmedBookings.filter(booking => {
            if (!booking.train) return false;

            const departureTimeStr = booking.train.departureTime;
            const createdAt = new Date(booking.createdAt || Date.now());

            const parsedMs = Date.parse(departureTimeStr);
            const isValidDate = !isNaN(parsedMs) && parsedMs > 946684800000;

            if (isValidDate) {
                return new Date(departureTimeStr) > now;
            }

            const { hours, minutes } = parseTime(departureTimeStr);
            const departureDate = new Date(createdAt);
            departureDate.setHours(hours, minutes, 0, 0);

            if (departureDate < createdAt) {
                departureDate.setDate(departureDate.getDate() + 1);
            }

            return departureDate > now;
        }).length;

        res.status(200).json({
            totalBookings,
            upcomingTrips
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// EXPORTS

module.exports = {

    createBooking,

    getBookings,

    getUserBookings,

    deleteBooking,

    cancelBooking,

    verifyTicket,

    updatePaymentStatus,

    getUserBookingStats,
};