const router = require("express").Router();

// Load Controllers
const {
  getValues,
  drawWinner
} = require("../controllers/user_play");

// Load Middleware
const { auth } = require("../middleware/auth");

// @route   GET /play/totals
// @desc  getting totals to render
// @access  Public
router.get("/totals", getValues);

// @route   GET /play/draw
// @desc  draw winner with secret route
// @access  Public
router.post("/draw", drawWinner);

module.exports = router;