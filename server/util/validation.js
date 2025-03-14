function isValidText(value, minLength = 1) {
  return value && value.trim().length >= minLength;
}

function isValidDate(value) {
  const date = new Date(value);
  return value && date !== 'Invalid Date';
}

function isValidImageUrl(value) {
  return value && value.startsWith('http');
}

function isValidEmail(value) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return value && emailRegex.test(value);;
}

function isValidPassword(value, minLength = 6) {
  return value && value.trim().length >= minLength;
}
"INSERT INTO users (name, email,gender,dateOfBirth,password) VALUES (?, ?, ?, ?, ?)"


exports.isValidText = isValidText;
exports.isValidDate = isValidDate;
exports.isValidImageUrl = isValidImageUrl;
exports.isValidEmail = isValidEmail;
exports.isValidPassword = isValidPassword;