const express = require("express");

const dotenv = require("dotenv");

const cors = require("cors");

const connectDB = require("./config/db");

const supportRoutes =
    require("./routes/supportRoutes");


dotenv.config();

connectDB();

const app = express();

const chatbotRoutes =
    require("./routes/chatbotRoutes");


// MIDDLEWARE

app.use(cors());

app.use(express.json());

app.use(
    "/api/chatbot",
    chatbotRoutes
);


// ROUTES

app.use(
    "/api/auth",
    require("./routes/authRoutes")
);
app.use(
    "/api/trains",
    require("./routes/trainRoutes")
);
app.use(
    "/api/bookings",
    require("./routes/bookingRoutes")
);

app.use(
    "/api/dashboard",
    require("./routes/dashboardRoutes")
);

app.use(
    "/api/users",
    require("./routes/userRoutes")
);

app.use(
    "/api/supports",
    supportRoutes
);

app.use(
    "/api/notifications",
    require("./routes/notificationRoutes")
);

// TEST ROUTE

app.get("/", (req, res) => {
    res.send("Railway API Running...");
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );
});