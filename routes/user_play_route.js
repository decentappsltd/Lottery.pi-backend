const router = require("express").Router();

// Load Controllers
const {
  playOne,
  playTen,
  getValues,
  drawWinner
} = require("../controllers/user_play");

// Load Middleware
const { auth } = require("../middleware/auth");

// @route   POST /play/ten
// @desc  playing with one ticket
// @access  Private
router.post("/one", auth, playOne);

// @route   POST /play/ten
// @desc  playing with ten tickets
// @access  Private
router.post("/ten", auth, playTen);

// @route   GET /play/totals
// @desc  getting totals to render
// @access  Public
router.get("/totals", getValues);

// @route   GET /play/draw
// @desc  draw winner with secret route
// @access  Public
router.post("/draw", drawWinner);

module.exports = router;