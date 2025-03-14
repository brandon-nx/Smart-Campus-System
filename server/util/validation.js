export function isEmail(email) {
  const pattern = /^[^@]+@soton\.ac\.uk$/i;
  return pattern.test(email);
}

export function isPassword(password) {
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);

  return hasUppercase && hasLowercase && hasDigit;
}

export function hasMinLength(value, minLength) {
  return value.length >= minLength;
}

export function isEqualsToOtherValue(value, otherValue) {
  return value === otherValue;
}

export function isNotEmpty(value) {
  return value.trim() !== "";
}

export function isValidText(value, minLength = 1) {
  return value && value.trim().length >= minLength;
}

export function isValidDate(value) {
  const date = new Date(value);
  return value && date !== 'Invalid Date';
}

export function isValidImageUrl(value) {
  return value && value.startsWith('http');
}

// "INSERT INTO users (name, email,gender,dateOfBirth,password) VALUES (?, ?, ?, ?, ?)" <- what is this?