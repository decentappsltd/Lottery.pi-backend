const _ = require("lodash");
const { genSalt, hash } = require("bcrypt");
const { isJWT, isEmail, equals } = require("validator");
const {
  errorStatus,
  infoStatus,
  statusCode,
} = require("../utils/reusableFunc");

// Load mailer and model
const { secretOrKey } = require("../config/keys");
const {
  validateUser,
  User,
} = require("../models/User_Register");

// Get the current user
const currentUser = async (req, res) => {
  try {
    if (req.user.name !== req.params.userName) {
      const message = "No user with that name found!!!";
      statusCode(res, message);
    }

    const user = await User.findOne({
      _id: req.user._id,
    }).select(["-password", "-tokens"]);
    if (!user) {
      const message = "No user found with that ID!";
      statusCode(res, message);
    }

    return res.json({ success: true, user });
  } catch (error) {
    const errorMessage = `Getting current user error ${error}`;
    infoStatus(res, errorMessage);
  }
};

// Register a new user
const registerUser = async (req, res) => {
  const { username } = req.body;

  let user = await User.findOne({ username });
  if (user) {
    const message = "Username already registered please login!!!";
    statusCode(res, message, 302);
  } else {
    // Create a new user after basic validation checks
    try {
      const createUser = _.pick(req.body, ["name", "username", "password"]);
      user = new User(createUser);

      // Encrypt , hash and save password
      const salt = await genSalt(10);
      user.password = await hash(user.password, salt);

      // Save the database
      await user.save();

      // Generate random and unique token for further account validation
      const userDetails = _.pick(user, ["name", "username"]);
      const token = await user.generateAuthToken();

      // Send validation email
      //   sendWelcomeEmail(user)
      return res.status(201).json({ success: true, user: userDetails, token });
    } catch (error) {
      const errorMessage = `User registration error: ${error}`;
      errorStatus(res, errorMessage);
    }
  }
};

module.exports = { currentUser, registerUser };