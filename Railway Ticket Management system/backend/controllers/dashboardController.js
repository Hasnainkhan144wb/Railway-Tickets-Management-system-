const User = require("../models/User");

const Train = require("../models/Train");

const Booking = require("../models/Booking");


// GET DASHBOARD STATS

const getDashboardStats = async (
  req,
  res
) => {

  try {

    // COUNT USERS

    const totalUsers =
      await User.countDocuments();

    // COUNT TRAINS

    const totalTrains =
      await Train.countDocuments();

    // TOTAL BOOKINGS

    const totalBookings =
      await Booking.countDocuments();

    // VERIFIED TICKETS OF CURRENT STAFF

    const verifiedTickets =
      await Booking.countDocuments({

        verified: true,

        verifiedBy: req.user.id,

      });

    // RECENT VERIFIED BOOKINGS

    const recentBookings =
      await Booking.find({

        verified: true,

        verifiedBy: req.user.id,

      })

        .populate("user")

        .populate("train")

        .sort({ createdAt: -1 })

        .limit(5);


    // RESPONSE

    res.status(200).json({

      totalUsers,

      totalTrains,

      totalBookings,

      verifiedTickets,

      recentBookings,

    });

  } catch (error) {

    res.status(500).json({

      message: error.message,

    });
  }
};

module.exports = {

  getDashboardStats,

};