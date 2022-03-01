const { User } = require("../models/User_Register");
const { UserProfile } = require("../models/User_Profile");
const { statusCode, errorStatus } = require("../utils/reusableFunc");

// Reusable functions
const user = async (req, res) => {
  const { _id } = req.session.user;
  const user = await User.findOne({
    _id,
  });
  if (!user) {
    const message = "No user found with that ID!";
    statusCode(res, message);
  }
};

const profile = async (req, res) => {
  const { _id } = req.session.user;
  const profile = await UserProfile.findOne({
    user: _id,
  });
  if (!profile) {
    const message = "No profile found for that user";
    statusCode(res, message);
  }
};

// Check if the user id is present
const isUser = async (req, res, next) => {
  try {
    await user(req, res);
    next();
  } catch (error) {
    const errorMessage = `Is user middleware error ${error}`;
    errorStatus(res, errorMessage);
  }
};

// Check if the user has created their profile
const isProfile = async (req, res, next) => {
  try {
    await profile(req, res);
    next();
  } catch (error) {
    const errorMessage = `Is profile middleware error ${error}`;
    errorStatus(res, errorMessage);
  }
};

// Check for both the user and profile
const isUserProfile = async (req, res, next) => {
  try {
    await user(req, res);
    await profile(req, res);

    next();
  } catch (error) {
    const errorMessage = `User profile middleware error ${error}`;
    errorStatus(res, errorMessage);
  }
};

module.exports = { isUser, isProfile, isUserProfile };