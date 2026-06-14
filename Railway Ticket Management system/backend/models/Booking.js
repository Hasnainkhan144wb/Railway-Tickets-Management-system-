const mongoose =
    require("mongoose");

const bookingSchema =
    new mongoose.Schema(

        {

            user: {

                type:
                    mongoose.Schema.Types.ObjectId,

                ref: "User",

                required: true,
            },


            train: {

                type:
                    mongoose.Schema.Types.ObjectId,

                ref: "Train",

                required: true,
            },


            // PASSENGER NAME

            passengerName: {

                type: String,

                required: true,
            },


            // CNIC

            cnic: {

                type: String,

                required: true,
            },


            // COACH NUMBER

            coachNumber: {

                type: String,

                required: false,
            },


            // SELECTED SEATS ARRAY

            selectedSeats: [

                {
                    coach: { type: String },
                    type: { type: String },
                    number: { type: String }
                },

            ],


            // SEAT TYPE

            seatType: {

                type: String,

                enum: [
                    "Side Seat",
                    "Berth",
                ],

                required: false,
            },


            // SEAT / BERTH NUMBER

            seatNumber: {

                type: String,

                required: false,
            },


            // NUMBER OF SEATS BOOKED

            seatsBooked: {

                type: Number,

                default: 1,
            },


            // PAYMENT ID

            paymentId: {

                type: String,
            },


            // PAYMENT STATUS

            paymentStatus: {

                type: String,

                enum: [
                    "pending",
                    "paid",
                ],

                default: "pending",
            },


            // VERIFY STATUS

            verified: {

                type: Boolean,

                default: false,
            },


            // BOOKING STATUS

            status: {

                type: String,

                enum: [
                    "confirmed",
                    "cancelled",
                    "Pending Verification",
                ],

                default: "confirmed",
            },


            // CANCELLATION DATE

            cancelledAt: {

                type: Date,

                default: null,
            },

        },

        {
            timestamps: true,
        }

    );

module.exports =
    mongoose.model(
        "Booking",
        bookingSchema
    );