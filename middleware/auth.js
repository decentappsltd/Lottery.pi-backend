const jwt = require("jsonwebtoken");
const { isJWT } = require("validator");
const { statusCode, errorStatus } = require("../utils/reusableFunc");

// Load utils and model
const { secretOrKey } = require("../config/keys");
const { User } = require("../models/User_Register");

// Authenticate user credentials for access
const auth = async (req, res, next) => {
  // Verify that it is a valid token
  // Here we need to make use of jwt
  let token = req.header("Authorization");
  if (!token || token === "" || token === null) {
    const message = "Access denied. No token provided";
    statusCode(res, message, 401);
  }

  // If token is present
  // Set token to the found header token
  token = req.header("Authorization").replace("Bearer ", "");

  // Verify the json web token found
  const isValidJwt = isJWT(token);
  if (!isValidJwt) {
    const message = "Auth validation, Invalid json web token!!!";
    statusCode(res, message, 401);
  }

  // Perform this block if jwt is present and valid
  try {
    const decoded = jwt.verify(token, secretOrKey);
    const user = await User.findOne({
      _id: decoded._id,
      username: decoded.username,
      "tokens.token": token,
    });

    if (!user) {
      const message = "You need to login or verify email";
      statusCode(res, message, 401);
    }

    // Set the current token to the current logged user
    req.token = token;
    req.user = user;
    req.session.user = user;

    // Pass control to the next middleware function in the req processing pipeline
    next();
  } catch (error) {
    const errorMessage = `Unable to authenticate this user : ${error}`;
    errorStatus(res, errorMessage);
  }
};

module.exports = { auth };