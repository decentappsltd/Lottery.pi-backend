const router = require("express").Router();

// Load middleware
const { auth } = require("../middleware/auth");

// Load controllers
const {
  logoutSession,
  logoutAllSession,
} = require("../controllers/user_logout");

// @route   POST /logout
// @desc  Authenticating and logging out user
// @access  Private
router.post("/", auth, logoutSession);

// @route   POST /logout/logout_all
// @desc  Authenticating and logging out all other sessions
// @access  Private
router.post("/logout_all", auth, logoutAllSession);

module.exports = router;