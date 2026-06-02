const User = require("../models/User");


// GET USERS

const getUsers = async (
  req,
  res
) => {

  try {

    const users =
      await User.find();

    res.json(users);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};


// DELETE USER

const deleteUser = async (
  req,
  res
) => {

  try {

    await User.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message:
        "User Deleted Successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {
  getUsers,
  deleteUser,
};