const User = require("../models/User");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");


// GENERATE JWT TOKEN

const generateToken = (id, role) => {

  return jwt.sign(
    {
      id,
      role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};


// REGISTER USER

const registerUser = async (req, res) => {

  try {

    const {
      name,
      email,
      password,
      role,
      accessCode,
    } = req.body;

    // VALIDATE ROLE ACCESS CODES
    if (role === "admin") {
      const adminCode = process.env.ADMIN_ACCESS_CODE || "admin123";
      if (accessCode !== adminCode) {
        return res.status(403).json({
          success: false,
          message: "Invalid Admin Access Code. Please check credentials.",
        });
      }
    } else if (role === "staff") {
      const staffCode = process.env.STAFF_ACCESS_CODE || "staff123";
      if (accessCode !== staffCode) {
        return res.status(403).json({
          success: false,
          message: "Invalid Staff Access Code. Please check credentials.",
        });
      }
    }

    // CHECK USER

    const userExists = await User.findOne({
      email,
    });

    if (userExists) {

      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // HASH PASSWORD

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(
      password,
      salt
    );

    // CREATE USER

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // RESPONSE

    res.status(201).json({
      success: true,
      message: "Registration Successful",

      token: generateToken(
        user._id,
        user.role
      ),

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// LOGIN USER

const loginUser = async (req, res) => {

  try {

    const {
      email,
      password,
    } = req.body;

    // CHECK EMAIL

    const user = await User.findOne({
      email,
    });

    if (!user) {

      return res.status(400).json({
        success: false,
        message: "Invalid Email",
      });
    }

    // CHECK PASSWORD

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {

      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    // RESPONSE

    res.status(200).json({
      success: true,
      message: "Login Successful",

      token: generateToken(
        user._id,
        user.role
      ),

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// CHECK EMAIL DUPLICATION

const checkEmail = async (req, res) => {

  try {

    const { email } = req.body;

    if (!email) {

      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const userExists = await User.findOne({
      email,
    });

    if (userExists) {

      return res.status(200).json({
        success: true,
        exists: true,
        message: "Email is already registered",
      });
    }

    return res.status(200).json({
      success: true,
      exists: false,
      message: "Email is available",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE USER PROFILE
const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, avatar } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (email && email !== user.email) {
      const emailTaken = await User.findOne({ email });
      if (emailTaken) {
        return res.status(400).json({
          success: false,
          message: "Email is already in use by another account",
        });
      }
      user.email = email;
    }

    if (name) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.json({
      success: true,
      message: "Profile Updated Successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  checkEmail,
  updateProfile,
};