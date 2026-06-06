const Support = require("../models/Support");

// CREATE SUPPORT REQUEST
const createSupport = async (req, res) => {
    try {
        const {
            user,
            subject,
            category,
            priority,
            attachment,
            message,
        } = req.body;

        const support = await Support.create({
            user,
            subject,
            category,
            priority,
            attachment: attachment || "",
            message,
            status: "pending",
            messages: [{
                sender: "passenger",
                senderName: "Passenger",
                text: message,
                createdAt: new Date()
            }]
        });

        res.status(201).json({
            message: "Support Request Submitted Successfully",
            support,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// GET ALL SUPPORT REQUESTS
const getSupports = async (req, res) => {
    try {
        const supports = await Support.find()
            .populate("user")
            .sort({ createdAt: -1 });
        res.json(supports);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// RESOLVE SUPPORT REQUEST
const resolveSupport = async (req, res) => {
    try {
        const { feedback } = req.body;
        const support = await Support.findById(req.params.id);

        if (!support) {
            return res.status(404).json({
                message: "Support request not found",
            });
        }

        support.status = "resolved";
        support.feedback = feedback || "Resolved by support staff";
        
        // Append a system chat message
        support.messages.push({
            sender: "staff",
            senderName: "Support Agent",
            text: `Ticket status updated to RESOLVED. Staff feedback: ${support.feedback}`,
            createdAt: new Date()
        });

        await support.save();
        res.json({
            message: "Support Request Resolved",
            support,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// ADD TICKET MESSAGE (CHAT)
const addMessage = async (req, res) => {
    try {
        const { sender, senderName, text } = req.body;
        const support = await Support.findById(req.params.id);

        if (!support) {
            return res.status(404).json({
                message: "Support ticket not found",
            });
        }

        // Auto-move status to in-progress if passenger sends a reply and status is pending
        if (sender === "passenger" && support.status === "pending") {
            support.status = "in-progress";
        }

        support.messages.push({
            sender,
            senderName: senderName || (sender === "passenger" ? "Passenger" : "Support Agent"),
            text,
            createdAt: new Date()
        });

        await support.save();
        res.status(200).json({
            success: true,
            support
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// RATE SUPPORT INTERACTION
const rateSupport = async (req, res) => {
    try {
        const { rating } = req.body;
        const support = await Support.findById(req.params.id);

        if (!support) {
            return res.status(404).json({
                message: "Support ticket not found",
            });
        }

        support.rating = rating;
        await support.save();

        res.status(200).json({
            success: true,
            message: "Thank you for your rating!",
            support
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// CLOSE SUPPORT TICKET
const closeTicket = async (req, res) => {
    try {
        const support = await Support.findById(req.params.id);

        if (!support) {
            return res.status(404).json({
                message: "Support ticket not found",
            });
        }

        support.status = "closed";
        support.messages.push({
            sender: "staff",
            senderName: "System",
            text: "Ticket has been closed. Thank you for using our support services.",
            createdAt: new Date()
        });

        await support.save();
        res.status(200).json({
            success: true,
            message: "Ticket closed successfully",
            support
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    createSupport,
    getSupports,
    resolveSupport,
    addMessage,
    rateSupport,
    closeTicket
};