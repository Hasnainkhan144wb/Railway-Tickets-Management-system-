const Train = require("../models/Train");
const Booking = require("../models/Booking");
const Notification = require("../models/Notification");


// GET ALL TRAINS

const getTrains =
  async (req, res) => {

    try {

      const trains =
        await Train.find();

      res.json(trains);

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
  };


// ADD TRAIN

const addTrain =
  async (req, res) => {

    try {

      const {
        trainName,
        source,
        destination,
        departureTime,
        ticketPrice,
        trainStatus,
        totalCoaches,
      } = req.body;


      // VALIDATE COACH COUNT
      const numCoaches = Number(totalCoaches) || 7;
      if (numCoaches < 1 || numCoaches > 7) {
        return res.status(400).json({
          message: "Number of coaches must be between 1 and 7",
        });
      }


      // AUTO GENERATE COACHES (1 Coach = 18 Seats + 60 Berths)
      const coaches = [];
      for (let i = 1; i <= numCoaches; i++) {
        const coach = {
          coachNumber: `C${i}`,
          seats: [],
        };

        // 18 Seats (01S to 18S)
        for (let s = 1; s <= 18; s++) {
          coach.seats.push({
            seatNumber: `${s.toString().padStart(2, "0")}S`,
            booked: false,
          });
        }

        // 60 Berths (01B to 60B)
        for (let b = 1; b <= 60; b++) {
          coach.seats.push({
            seatNumber: `${b.toString().padStart(2, "0")}B`,
            booked: false,
          });
        }

        coaches.push(coach);
      }


      const totalSeatsCount = numCoaches * 78;
      const totalSeatsField = numCoaches * 18;
      const totalBerthsField = numCoaches * 60;

      const train =
        await Train.create({
          trainName,
          source,
          destination,
          departureTime,
          ticketPrice,
          trainStatus,
          totalCoaches: numCoaches,
          totalSeats: totalSeatsCount,
          seats: totalSeatsCount,
          availableSeats: totalSeatsField,
          availableBerths: totalBerthsField,
          totalBerths: totalBerthsField,
          coaches,
        });

      res.status(201).json({
        message: "Train Added Successfully",
        train,
      });

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
  };


// DELETE TRAIN

const deleteTrain =
  async (req, res) => {

    try {

      await Train.findByIdAndDelete(
        req.params.id
      );

      res.json({

        message:
          "Train Deleted Successfully",

      });

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
  };


// UPDATE TRAIN STATUS & SCHEDULE

const updateTrain =
  async (req, res) => {

    try {

      const {

        departureTime,

        trainStatus,

        seats,

      } = req.body;

      const train =
        await Train.findById(
          req.params.id
        );

      if (!train) {

        return res.status(404).json({

          message:
            "Train not found",

        });
      }

      const oldStatus = train.trainStatus;
      const oldTime = train.departureTime;

      train.departureTime =
        departureTime ||
        train.departureTime;

      train.trainStatus =
        trainStatus ||
        train.trainStatus;

      train.seats =
        seats ||
        train.seats;

      await train.save();

      const timeChanged = departureTime && departureTime !== oldTime;
      const statusChanged = trainStatus && trainStatus !== oldStatus;

      if (timeChanged || statusChanged) {
        try {
          const bookings = await Booking.find({ train: train._id, status: "confirmed" });
          const userIds = [...new Set(bookings.map(b => b.user.toString()))];

          for (const userId of userIds) {
            let title = "Train Update";
            let message = `Train #${train.trainName || train._id} schedule/status update.`;

            if (statusChanged && trainStatus === "Cancelled") {
              title = "Train Cancelled";
              message = `Train #${train.trainName || train.trainStatus} has been cancelled.`;
            } else if (statusChanged && trainStatus === "Delayed") {
              title = "Train Delayed";
              message = `Train #${train.trainName} has been delayed. Departure: ${train.departureTime}.`;
            } else if (timeChanged) {
              title = "Train Delayed";
              message = `Train #${train.trainName} delay/schedule updated to ${departureTime}.`;
            } else if (statusChanged) {
              title = "Train Status Updated";
              message = `Train #${train.trainName} is now ${trainStatus}.`;
            }

            await Notification.create({
              user: userId,
              title,
              message,
            });
          }
        } catch (err) {
          console.error("Failed to notify passengers about train change:", err);
        }
      }

      res.json({

        message:
          "Train Updated Successfully",

        train,

      });

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
  };


module.exports = {

  getTrains,

  addTrain,

  deleteTrain,

  updateTrain,

};