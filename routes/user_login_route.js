const router = require("express").Router();

// Load Controllers
const { login } = require("../controllers/user_login");

// @route   POST /login
// @desc    Login a new user
// @access  Public
router.post("/", login);

module.exports = router;