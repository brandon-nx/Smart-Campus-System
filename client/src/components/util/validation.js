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
