const { compare } = require("bcrypt");

// Load utils and model
const { errorStatus, statusCode } = require("../utils/reusableFunc");
const { validateLogin, User } = require("../models/User_Register");

// Login a user
const login = async (req, res) => {
  const { username, password: userPassword } = req.body;

  // Validate the user credentials
  const { error } = validateLogin(req.body);
  if (error) {
    const message = error.details[0].message;
    statusCode(res, message, 400);
  } else {
    // Find and validate user credentials
    // return error if account is not verified or found
    try {
      let user = await User.findOne({ username });
      const message = "Invalid Username or password";
      if (!user) statusCode(res, message, 400);
      else {
        // Compare and validate user input with stored credential
        const validatePassword = await compare(userPassword, user.password);
        if (!validatePassword) statusCode(res, message, 400);

        // Generate and implement a new jsonwebtoken
        const token = await user.generateAuthToken();

        // Remove password and store user to session
        delete user["password"];
        req.session.user = user;

        return res
          .header("Authorization", token)
          .json({ success: true, token });
      }
    } catch (error) {
      const errorMessage = `Login error : ${error}`;
      errorStatus(res, errorMessage);
    }
  }
};

// login using UID from Pi.athenticate in the Pi Browser
const piLogin = async (req, res) => {
  const uid = req.body.uid;
  try {
    let user = await User.findOne({ uid });
    if (!user) statusCode(res, 400);
    else {
      // Generate and implement a new jsonwebtoken
      const token = await user.generateAuthToken();

      // Store user to session
      req.session.user = user;

      return res
        .header("Authorization", token)
        .json({ success: true, token });
    }
  } catch (error) {
      const errorMessage = `Login error : ${error}`;
      errorStatus(res, errorMessage);
    }
}

const addPi = async (req, res) => {
  const uid = req.body.uid;
  const { _id } = req.session.user;
  const user = await User.findOneAndUpdate({ user: _id }, { uid: uid }, { new: true });
  return res.json({ success: true });
}

//  Axios.defaults.withCredentials = true

module.exports = { login, piLogin, addPi };