const express = require("express");

const router = express.Router();

const {
  getDashboardStats,
} = require("../controllers/dashboardController");


// ROUTE

router.get(
  "/stats",
  getDashboardStats
);

module.exports = router;