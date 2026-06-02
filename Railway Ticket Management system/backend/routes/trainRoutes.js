const express =
  require("express");

const router =
  express.Router();

const {
  getTrains,
  addTrain,
  deleteTrain,
  updateTrain,
} = require("../controllers/trainController");


// GET ALL TRAINS

router.get(
  "/",
  getTrains
);


// ADD TRAIN

router.post(
  "/",
  addTrain
);


// DELETE TRAIN

router.delete(
  "/:id",
  deleteTrain
);


// UPDATE TRAIN

router.put(
  "/:id",
  updateTrain
);


module.exports =
  router;