module.exports.isValidString = function isValidString(str) {
  return typeof str === 'string' && str.trim().length > 0;
};

module.exports.isValidInteger = function isInteger(value) {
  return typeof value === 'number' && Number.isInteger(value);
};

module.exports.isValidNumber = function isValidNumber(value) {
  return typeof value === 'number' && !isNaN(value);
};

module.exports.isValidEmail = function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
};

module.exports.isValidPhoneNumber = function isValidPhoneNumber(phoneNumber) {
  const phoneRegex = /^\+(?:[0-9] ?){6,14}[0-9]$/;
  return phoneRegex.test(phoneNumber);
};

module.exports.isValidDate = function isValidDate(dateStr) {
  return !isNaN(Date.parse(dateStr));
};

module.exports.isValidStatus = function isValidStatus(statusStr) {
  return [true, false].includes(statusStr);
};

module.exports.isValidArrayWithData = function validateInput(input) {
  if (!Array.isArray(input) || input.length === 0) {
    return false;
  }
  for (const item of input) {
    if (typeof item !== 'string' || item.trim() === '') {
      return false;
    }
  }
  return true;
};
