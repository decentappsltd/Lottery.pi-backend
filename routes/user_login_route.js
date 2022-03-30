const router = require("express").Router();

// Load middleware
const { auth } = require("../middleware/auth");
const { isUserProfile } = require("../middleware/isUserMiddleware");
const isAuthenticated = [auth, isUserProfile];

// Load Controllers
const { login, piLogin, addPi } = require("../controllers/user_login");

// @route   POST /login
// @desc    Login a new user
// @access  Public
router.post("/", login);

// @route   POST /login/pi
// @desc    Login a new user
// @access  Public
router.post("/pi", piLogin);

// @route   POST /login
// @desc    Login a new user
// @access  Public
router.post("/add", isAuthenticated, addPi);

module.exports = router;