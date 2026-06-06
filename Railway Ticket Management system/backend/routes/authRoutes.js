const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
  checkEmail,
  updateProfile,
} = require("../controllers/authController");


// ROUTES

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/check-email", checkEmail);

router.put("/profile/:id", updateProfile);

module.exports = router;