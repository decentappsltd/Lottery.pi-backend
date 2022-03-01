// Load utils and model
const { errorStatus } = require("../utils/reusableFunc");

// Logout the current session only
const logoutSession = async (req, res) => {
  // Filter through all stored tokens
  // Other tokens remain valid except the current token
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );

    delete res.header("Authorization") === req.token;
    await req.user.save();

    return res.json({ success: true, message: "User logged out!" });
  } catch (error) {
    const errorMessage = `Unable to log user out error: ${error}`;
    errorStatus(res, errorMessage);
  }
};

// Logout all sessions except the current session
const logoutAllSession = async (req, res) => {
  // Filter through all stored tokens
  // Other tokens become invalid except the current token
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token === req.token
    );
    await req.user.save();

    return res.json({ success: true, message: "Users logged out!" });
  } catch (error) {
    const errorMessage = `Unable to log other sessions out error : ${error}`;
    errorStatus(res, errorMessage);
  }
};

module.exports = { logoutAllSession, logoutSession };