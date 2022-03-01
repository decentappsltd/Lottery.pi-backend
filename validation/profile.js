const { isLength, isEmpty: validatorIsEmpty } = require("validator");
const isEmpty = require("./customValidation/is-empty");

// Validate the user input on creating a profile
function validateProfileInput({ handle }) {
  let errors = {};

  handle = !isEmpty(handle) ? handle : "";

  if (!isLength(handle, { min: 3, max: 20 })) {
    errors.handle = "Handle needs to be between 3 and 20 characters";
  }

  if (validatorIsEmpty(handle)) {
    errors.handle = "Profile handle is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

module.exports = { validateProfileInput };