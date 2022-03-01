const router = require("express").Router();

// Load Controllers
const {
  paymentApprove,
  paymentComplete,
  paymentIncomplete
} = require("../controllers/pi_payment");

// @route   POST /payment/approve
// @desc  payment approved
// @access  Public
router.post("/approve", paymentApprove);

// @route   POST /payment/complete
// @desc  payment complete
// @access  Public
router.post("/complete", paymentComplete);

// @route   POST /payment/incomplete
// @desc  payment incomplete
// @access  Public
router.post("/incomplete", paymentIncomplete);

module.exports = router;