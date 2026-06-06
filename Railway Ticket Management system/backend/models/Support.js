const mongoose = require("mongoose");

const supportSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        subject: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
            default: "general",
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
        },
        attachment: {
            type: String,
            default: "",
        },
        message: {
            type: String,
            required: true,
        },
        feedback: {
            type: String,
            default: "",
        },
        rating: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: [
                "pending",
                "in-progress",
                "resolved",
                "closed"
            ],
            default: "pending",
        },
        messages: [
            {
                sender: {
                    type: String,
                    enum: ["passenger", "staff"],
                    required: true,
                },
                senderName: {
                    type: String,
                    required: true,
                },
                text: {
                    type: String,
                    required: true,
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                }
            }
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Support", supportSchema);