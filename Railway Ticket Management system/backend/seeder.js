const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

// MODEL
const User = require("./models/User");

dotenv.config();

const seedAdmin = async () => {
  try {
    // Connect Database
    await mongoose.connect("mongodb://127.0.0.1:27017/railwayDB");
    console.log("✅ Database Connected");

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("Hasnain@2026", salt);

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      email: "admin@railway.gov.pk",
    });

    if (existingAdmin) {
      // ✅ UPDATE PASSWORD if admin exists
      existingAdmin.password = hashedPassword;
      existingAdmin.name = "Muhammad Hasnain";
      existingAdmin.role = "admin";
      existingAdmin.avatar = "";

      await existingAdmin.save();

      console.log("⚠️ Admin already existed → Password UPDATED");
      console.log({
        name: existingAdmin.name,
        email: existingAdmin.email,
        role: existingAdmin.role,
      });

      process.exit(0);
    }

    // ❌ If admin does NOT exist → CREATE new admin
    const admin = await User.create({
      name: "Muhammad Hasnain",
      email: "admin@railway.gov.pk",
      password: hashedPassword,
      role: "admin",
      avatar: "",
    });

    console.log("✅ Admin Seeded Successfully");
    console.log({
      name: admin.name,
      email: admin.email,
      role: admin.role,
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding Failed:", error);
    process.exit(1);
  }
};

seedAdmin();