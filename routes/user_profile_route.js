const router = require("express").Router();

// Load Middleware
const { auth } = require("../middleware/auth");
const { isUser, isProfile } = require("../middleware/isUserMiddleware");

// Load Controllers
const {
  getMyProfile,
  createProfile,
  profileByHandle,
  profileByUserId,
  deleteAccount,
} = require("../controllers/user_profile");

// @route   GET /profile
// @desc    Get Current user's profile
// @access  Private
router.get("/", auth, getMyProfile);

// @route   GET /profile/handle/:handle
// @desc    Get profile by handle
// @access  Public
router.get("/handle/:handle", profileByHandle);

// @route   GET /profile/user/:user_id
// @desc    Get profile by user id
// @access  Public
router.get("/user/:user_id", profileByUserId);

// @route   POST /profile
// @desc    Create or edit user profile
// @access  Private
router.post("/", auth, createProfile);

// @route   DELETE /profile
// @desc    Delete user and profile
// @access  Private
router.delete("/", [auth, isProfile], deleteAccount);

module.exports = router;
