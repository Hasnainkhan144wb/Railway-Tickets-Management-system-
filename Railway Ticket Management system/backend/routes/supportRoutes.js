const express = require("express");
const router = express.Router();
const {
    createSupport,
    getSupports,
    resolveSupport,
    addMessage,
    rateSupport,
    closeTicket
} = require("../controllers/supportController");

// CREATE REQUEST
router.post("/", createSupport);

// GET REQUESTS
router.get("/", getSupports);

// RESOLVE REQUEST
router.put("/resolve/:id", resolveSupport);

// ADD MESSAGE TO CHAT
router.put("/:id/message", addMessage);

// RATE TICKET SERVICE
router.put("/:id/rate", rateSupport);

// CLOSE TICKET
router.put("/:id/close", closeTicket);

module.exports = router;