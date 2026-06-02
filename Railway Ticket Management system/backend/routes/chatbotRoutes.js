const express = require("express");
const router = express.Router();
const { askGemini } = require("../services/geminiService");

const Train = require("../models/Train");
const Booking = require("../models/Booking");
const Notification = require("../models/Notification");

router.post(
    "/ask",
    async (req, res) => {
        try {
            const { message, userId } = req.body;

            if (!message) {
                return res.status(400).json({ message: "Message is required" });
            }

            let dbContext = "";
            const cleanedMsg = message.toLowerCase().trim();

            if (cleanedMsg.includes("cancel") || cleanedMsg.includes("cancellation") || cleanedMsg.includes("canceling")) {
                dbContext = `System Database Context:
Cancellation Instructions:
To cancel a ticket, the passenger needs to navigate to the "My Bookings" page from the sidebar and click the "Cancel" button on the booking row. Confirmed tickets will be cancelled instantly, and seats will be released.
`;
            } else if (cleanedMsg.includes("pending") || cleanedMsg.includes("unpaid") || cleanedMsg.includes("pay")) {
                if (userId) {
                    const bookings = await Booking.find({ user: userId, paymentStatus: "pending" }).populate("train");
                    dbContext = `System Database Context:
User's Pending Payments:
${bookings.length > 0 ? bookings.map(b => `- Booking ID: ${b._id}, Train: ${b.train?.trainName || "N/A"}, Total Fare: Rs. ${b.seatsBooked * (b.train?.ticketPrice || 0)}, Payment ID: ${b.paymentId}`).join("\n") : "No pending payments found. All tickets are paid."}
`;
                } else {
                    dbContext = "System Database Context: User is not logged in. Tell them they need to log in to view pending payments.";
                }
            } else if (cleanedMsg.includes("booking") || cleanedMsg.includes("ticket") || cleanedMsg.includes("my bookings") || cleanedMsg.includes("show my bookings")) {
                if (userId) {
                    const bookings = await Booking.find({ user: userId }).populate("train");
                    dbContext = `System Database Context:
User's Booking Records:
${bookings.length > 0 ? bookings.map(b => `- Booking ID: ${b._id}, Train: ${b.train?.trainName || "N/A"}, Route: ${b.train?.source || "N/A"} to ${b.train?.destination || "N/A"}, Seats: ${b.seatsBooked}, Status: ${b.status}, Payment: ${b.paymentStatus}, Date Booked: ${new Date(b.createdAt).toLocaleDateString()}`).join("\n") : "No bookings found for this user."}
`;
                } else {
                    dbContext = "System Database Context: User is not logged in. Tell them they need to log in to view their bookings.";
                }
            } else if (cleanedMsg.includes("notification") || cleanedMsg.includes("alert")) {
                if (userId) {
                    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 }).limit(5);
                    dbContext = `System Database Context:
User's Recent Notifications:
${notifications.length > 0 ? notifications.map(n => `- [${new Date(n.createdAt).toLocaleDateString()}] ${n.title}: ${n.message}`).join("\n") : "No notifications found."}
`;
                } else {
                    dbContext = "System Database Context: User is not logged in. Tell them they need to log in to view notifications.";
                }
            } else if (cleanedMsg.includes("delay") || cleanedMsg.includes("late") || cleanedMsg.includes("status")) {
                const delayedTrains = await Train.find({ trainStatus: { $regex: /^delayed$/i } });
                dbContext = `System Database Context:
Delayed Trains today:
${delayedTrains.length > 0 ? delayedTrains.map(t => `- ${t.trainName}: Delayed (Route: ${t.source} to ${t.destination}), scheduled departure was ${t.departureTime}.`).join("\n") : "All trains are running on schedule. No delays reported today."}
`;
            } else {
                const searchMatch = cleanedMsg.match(/(?:trains?\s+)?(?:from\s+)?([a-zA-Z\s]+)\s+to\s+([a-zA-Z\s]+)/i);
                const seatsMatch = cleanedMsg.match(/(?:available\s+)?seats\s+(?:in\s+)?([a-zA-Z0-9\s]+)/i);
                const fareMatch = cleanedMsg.match(/(?:fare|price|ticket\s+price)\s+(?:of\s+)?([a-zA-Z0-9\s]+)/i);

                if (searchMatch) {
                    const source = searchMatch[1].trim();
                    const destination = searchMatch[2].trim();
                    const trains = await Train.find({
                        source: { $regex: new RegExp(`^${source}$`, "i") },
                        destination: { $regex: new RegExp(`^${destination}$`, "i") }
                    });
                    dbContext = `System Database Context:
The user is searching for trains from "${source}" to "${destination}".
Available Trains in Database:
${trains.length > 0 ? trains.map(t => `- ${t.trainName}: Departure Time ${t.departureTime}, Price Rs. ${t.ticketPrice}, Available Seats ${t.availableSeats ?? (t.totalCoaches * 18)}S / ${t.availableBerths ?? (t.totalCoaches * 60)}B`).join("\n") : "No trains found for this route."}
`;
                } else if (seatsMatch || fareMatch) {
                    const trainName = (seatsMatch ? seatsMatch[1] : fareMatch[1]).trim();
                    const trains = await Train.find({
                        trainName: { $regex: new RegExp(trainName, "i") }
                    });
                    dbContext = `System Database Context:
The user is asking about the seats/fare of train "${trainName}".
Matching Trains in Database:
${trains.length > 0 ? trains.map(t => `- ${t.trainName}: Ticket Price Rs. ${t.ticketPrice}, Available Seats: ${t.availableSeats ?? (t.totalCoaches * 18)} Seats, ${t.availableBerths ?? (t.totalCoaches * 60)} Berths.`).join("\n") : "No trains matching this name found in the database."}
`;
                }
            }

            const prompt = `You are a helpful, professional, and friendly Railway AI Assistant for the Railway Ticket Management System.
You have access to the system's database information provided below (if applicable).
Use this database information to answer the user's queries accurately. If the database information is missing, incomplete, or says no records found, explain that politely.
Always respond professionally, concisely, and keep your formatting clean (using bullet points or numbered lists where appropriate).

${dbContext}

User message: ${message}`;

            const reply = await askGemini(prompt);

            res.json({
                reply,
            });

        } catch (error) {
            console.error("Chatbot Controller Error:", error);
            res.status(500).json({
                message: "AI Error",
            });
        }
    }
);

module.exports = router;