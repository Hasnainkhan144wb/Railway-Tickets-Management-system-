const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

// MODELS
const User = require("./models/User");
const Train = require("./models/Train");
const Booking = require("./models/Booking");
const Support = require("./models/Support");

dotenv.config();

// Helper to generate coaches for a train
const generateCoaches = (totalCoaches = 7) => {
  const coaches = [];
  for (let c = 1; c <= totalCoaches; c++) {
    const coachNumber = `C${c}`;
    const seats = [];
    for (let s = 1; s <= 32; s++) {
      seats.push({
        seatNumber: `${coachNumber}-${s}`,
        booked: false,
      });
    }
    coaches.push({
      coachNumber,
      seats,
    });
  }
  return coaches;
};

const seedData = async () => {
  try {
    // 1. CONNECT TO DATABASE
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB Connected for Seeding...");

    // 2. CLEAR EXISTING COLLECTIONS
    await User.deleteMany();
    await Train.deleteMany();
    await Booking.deleteMany();
    await Support.deleteMany();
    console.log("Existing collections cleared.");

    // 3. SEED USERS WITH HASHED PASSWORDS
    const salt = await bcrypt.genSalt(10);
    const commonPassword = await bcrypt.hash("Pass12345", salt);

    const usersData = [
      // Admins
      {
        name: "Muhammad Hasnain",
        email: "admin@railway.gov.pk",
        password: commonPassword,
        role: "admin",
        avatar: "",
      },
      {
        name: "M Adeel",
        email: "adeel@railway.gov.pk",
        password: commonPassword,
        role: "admin",
        avatar: "",
      },
      // Staff
      {
        name: "Tariq Mahmood",
        email: "tariq@railway.gov.pk",
        password: commonPassword,
        role: "staff",
        avatar: "",
      },
      {
        name: "Yasmin Khan",
        email: "yasmin@railway.gov.pk",
        password: commonPassword,
        role: "staff",
        avatar: "",
      },
      {
        name: "Faisal Qureshi",
        email: "faisal@railway.gov.pk",
        password: commonPassword,
        role: "staff",
        avatar: "",
      },
      // Passengers
      {
        name: "Hamza Abbasi",
        email: "hamza@gmail.com",
        password: commonPassword,
        role: "passenger",
        avatar: "",
      },
      {
        name: "Zainab Yousuf",
        email: "zainab@gmail.com",
        password: commonPassword,
        role: "passenger",
        avatar: "",
      },
      {
        name: "Bilal Siddiqui",
        email: "bilal@gmail.com",
        password: commonPassword,
        role: "passenger",
        avatar: "",
      },
      {
        name: "Sania Mirza",
        email: "sania@gmail.com",
        password: commonPassword,
        role: "passenger",
        avatar: "",
      },
      {
        name: "Kamran Akmal",
        email: "kamran@gmail.com",
        password: commonPassword,
        role: "passenger",
        avatar: "",
      },
    ];

    const seededUsers = await User.insertMany(usersData);
    console.log(`${seededUsers.length} Users seeded successfully.`);

    // 4. SEED TRAINS (PAKISTANI RAILWAY SCHEDULING)
    const trainsData = [
      {
        trainName: "Tezgam Express (7UP)",
        source: "Karachi Cantt",
        destination: "Rawalpindi",
        departureTime: "05:30 PM",
        ticketPrice: 1850,
        totalCoaches: 8,
        seats: 256,
        totalSeats: 256,
        availableSeats: 256,
        availableBerths: 120,
        totalBerths: 120,
        trainStatus: "On Time",
        coaches: generateCoaches(8),
      },
      {
        trainName: "Khyber Mail (1UP)",
        source: "Karachi Cantt",
        destination: "Peshawar Cantt",
        departureTime: "10:15 PM",
        ticketPrice: 2200,
        totalCoaches: 10,
        seats: 320,
        totalSeats: 320,
        availableSeats: 320,
        availableBerths: 160,
        totalBerths: 160,
        trainStatus: "On Time",
        coaches: generateCoaches(10),
      },
      {
        trainName: "Green Line Express (5UP)",
        source: "Karachi Cantt",
        destination: "Islamabad Margalla",
        departureTime: "08:00 AM",
        ticketPrice: 3450,
        totalCoaches: 8,
        seats: 256,
        totalSeats: 256,
        availableSeats: 256,
        availableBerths: 120,
        totalBerths: 120,
        trainStatus: "On Time",
        coaches: generateCoaches(8),
      },
      {
        trainName: "Karakoram Express (41UP)",
        source: "Karachi Cantt",
        destination: "Lahore Junction",
        departureTime: "04:00 PM",
        ticketPrice: 1950,
        totalCoaches: 9,
        seats: 288,
        totalSeats: 288,
        availableSeats: 288,
        availableBerths: 144,
        totalBerths: 144,
        trainStatus: "On Time",
        coaches: generateCoaches(9),
      },
      {
        trainName: "Shalimar Express (27UP)",
        source: "Karachi Cantt",
        destination: "Lahore Junction",
        departureTime: "06:00 AM",
        ticketPrice: 1800,
        totalCoaches: 7,
        seats: 224,
        totalSeats: 224,
        availableSeats: 224,
        availableBerths: 112,
        totalBerths: 112,
        trainStatus: "Delayed",
        coaches: generateCoaches(7),
      },
      {
        trainName: "Jaffar Express (39UP)",
        source: "Quetta",
        destination: "Peshawar Cantt",
        departureTime: "09:00 AM",
        ticketPrice: 1650,
        totalCoaches: 8,
        seats: 256,
        totalSeats: 256,
        availableSeats: 256,
        availableBerths: 120,
        totalBerths: 120,
        trainStatus: "On Time",
        coaches: generateCoaches(8),
      },
      {
        trainName: "Allama Iqbal Express (9UP)",
        source: "Karachi Cantt",
        destination: "Sialkot Junction",
        departureTime: "02:00 PM",
        ticketPrice: 1550,
        totalCoaches: 8,
        seats: 256,
        totalSeats: 256,
        availableSeats: 256,
        availableBerths: 120,
        totalBerths: 120,
        trainStatus: "On Time",
        coaches: generateCoaches(8),
      },
    ];

    const seededTrains = await Train.insertMany(trainsData);
    console.log(`${seededTrains.length} Railway Trains seeded successfully.`);

    // Extract reference models
    const passengerHamza = seededUsers.find((u) => u.email === "hamza@gmail.com");
    const passengerZainab = seededUsers.find((u) => u.email === "zainab@gmail.com");
    const passengerBilal = seededUsers.find((u) => u.email === "bilal@gmail.com");

    const trainGreenLine = seededTrains.find((t) => t.trainName.includes("Green Line"));
    const trainKarakoram = seededTrains.find((t) => t.trainName.includes("Karakoram"));
    const trainTezgam = seededTrains.find((t) => t.trainName.includes("Tezgam"));

    // 5. SEED BOOKINGS
    const bookingsData = [
      {
        user: passengerHamza._id,
        train: trainGreenLine._id,
        passengerName: passengerHamza.name,
        cnic: "42101-7654321-3",
        coachNumber: "C1",
        seatNumber: "C1-5",
        seatsBooked: 1,
        selectedSeats: [{ coach: "C1", type: "Berth", number: "C1-5" }],
        seatType: "Berth",
        paymentId: "TXN_GL88271",
        paymentStatus: "paid",
        verified: true,
        status: "confirmed",
      },
      {
        user: passengerZainab._id,
        train: trainKarakoram._id,
        passengerName: passengerZainab.name,
        cnic: "35201-9988776-4",
        coachNumber: "C2",
        seatNumber: "C2-12",
        seatsBooked: 1,
        selectedSeats: [{ coach: "C2", type: "Side Seat", number: "C2-12" }],
        seatType: "Side Seat",
        paymentId: "TXN_KK33441",
        paymentStatus: "paid",
        verified: false,
        status: "confirmed",
      },
      {
        user: passengerBilal._id,
        train: trainTezgam._id,
        passengerName: passengerBilal.name,
        cnic: "61101-4455667-5",
        coachNumber: "C4",
        seatNumber: "C4-21",
        seatsBooked: 1,
        selectedSeats: [{ coach: "C4", type: "Berth", number: "C4-21" }],
        seatType: "Berth",
        paymentId: "TXN_TG99823",
        paymentStatus: "pending",
        verified: false,
        status: "confirmed",
      },
    ];

    const seededBookings = await Booking.insertMany(bookingsData);
    console.log(`${seededBookings.length} Bookings seeded successfully.`);

    // 6. SEED SUPPORT TICKETS
    const supportsData = [
      {
        user: passengerHamza._id,
        subject: "Seat Class Refund Inquiry",
        category: "ticket issue",
        priority: "high",
        message: "Assalam-o-Alaikum, I booked an AC Sleeper berth on Green Line but would like to downgrade/refund. Please check.",
        status: "pending",
        messages: [
          {
            sender: "passenger",
            senderName: passengerHamza.name,
            text: "Assalam-o-Alaikum, I booked an AC Sleeper berth on Green Line but would like to downgrade/refund. Please check.",
            createdAt: new Date(),
          },
        ],
      },
      {
        user: passengerZainab._id,
        subject: "Double Payment Error via Easypaisa",
        category: "payment issue",
        priority: "medium",
        message: "Payment of Rs 1950 was deducted twice from my mobile wallet account. Please adjust.",
        status: "pending",
        messages: [
          {
            sender: "passenger",
            senderName: passengerZainab.name,
            text: "Payment of Rs 1950 was deducted twice from my mobile wallet account. Please adjust.",
            createdAt: new Date(),
          },
        ],
      },
      {
        user: passengerBilal._id,
        subject: "Shalimar Delay Inquiry",
        category: "train delay",
        priority: "low",
        message: "Is Shalimar Express arriving late at Lahore Junction today?",
        status: "resolved",
        feedback: "Resolved: Passenger updated via text message. Train delay is estimated at 45 minutes.",
        messages: [
          {
            sender: "passenger",
            senderName: passengerBilal.name,
            text: "Is Shalimar Express arriving late at Lahore Junction today?",
            createdAt: new Date(),
          },
          {
            sender: "staff",
            senderName: "Tariq Mahmood",
            text: "Yes, Shalimar Express is delayed by 45 minutes today due to engine checkups.",
            createdAt: new Date(),
          },
        ],
      },
    ];

    const seededSupports = await Support.insertMany(supportsData);
    console.log(`${seededSupports.length} Support requests seeded successfully.`);

    console.log("SEVERAL SEED DATA GENERATED SUCCESSFULLY!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedData();
