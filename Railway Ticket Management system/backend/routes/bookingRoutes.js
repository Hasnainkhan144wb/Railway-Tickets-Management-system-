const express = require("express");

const router = express.Router();

const {
  createBooking,
  getBookings,
  getUserBookings,
  deleteBooking,
  cancelBooking,
  verifyTicket,
  updatePaymentStatus,
  getUserBookingStats,
} = require("../controllers/bookingController");

// CREATE BOOKING

router.post("/", createBooking);


// ALL BOOKINGS

router.get("/", getBookings);


// USER BOOKINGS

router.get(
    "/user/:userId",
    getUserBookings
);

router.get(
    "/user/:userId/stats",
    getUserBookingStats
);

router.delete(
    "/:id",
    deleteBooking
);

router.put(
    "/cancel/:id",
    cancelBooking
);

router.put(
  "/verify/:id",
  verifyTicket
);

router.put(
  "/payment/:id",
  updatePaymentStatus
);
module.exports = router;