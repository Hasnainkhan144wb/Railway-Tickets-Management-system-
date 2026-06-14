const mongoose =
  require("mongoose");

const trainSchema =
  new mongoose.Schema(

    {

      trainName: {

        type: String,

        required: true,
      },


      source: {

        type: String,

        required: true,
      },


      destination: {

        type: String,

        required: true,
      },


      departureTime: {

        type: String,

        required: true,
      },

      travelDate: {
        type: String,
        required: true,
      },


      // TOTAL AVAILABLE CAPACITY
      seats: {
        type: Number,
        default: 224,
      },

      // TOTAL CAPACITY
      totalSeats: {
        type: Number,
        default: 224,
      },

      availableSeats: {
        type: Number,
        default: 126,
      },

      availableBerths: {
        type: Number,
        default: 420,
      },

      totalBerths: {
        type: Number,
        default: 420,
      },

      // TOTAL COACHES
      totalCoaches: {
        type: Number,
        default: 7,
      },


      // TICKET PRICE

      ticketPrice: {

        type: Number,

        required: true,
      },


      // TRAIN STATUS

      trainStatus: {

        type: String,

        enum: [
          "On Time",
          "Delayed",
          "Cancelled",
        ],

        default: "On Time",
      },


      // COACHES DATA

      coaches: [

        {

          coachNumber: {

            type: String,
          },

          seats: [

            {

              seatNumber: {

                type: String,
              },

              booked: {

                type: Boolean,

                default: false,
              },

            },

          ],

        },

      ],

    },

    {
      timestamps: true,
    }

  );

module.exports =
  mongoose.model(
    "Train",
    trainSchema
  );