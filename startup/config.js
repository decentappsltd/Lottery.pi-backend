// Load Utils
const { secretOrKey } = require("../config/keys");

module.exports = () => {
  // Setting the environmental variable
  if (!secretOrKey) throw new Error(`FATAL ERROR: Secret key is not defined.`);
  return;
};