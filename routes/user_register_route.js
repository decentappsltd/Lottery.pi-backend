const router = require("express").Router();

// Load middleware
const { auth } = require("../middleware/auth");

// Load Controllers
const {
  currentUser,
  registerUser,
} = require("../controllers/user_register");

// @route   GET /register
// @desc    Get current user
// @access  Private
router.get("/", auth, currentUser);

// @route   POST /register
// @desc    Register a new user
// @access  Public
router.post("/", registerUser);

module.exports = router;