const express = require("express");

const router = express.Router();

const {
  getUsers,
  deleteUser,
} = require("../controllers/userController");


// GET USERS

router.get("/", getUsers);


// DELETE USER

router.delete(
  "/:id",
  deleteUser
);

module.exports = router;