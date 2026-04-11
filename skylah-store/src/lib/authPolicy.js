export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_RULE = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^\w\s]).{6,}$/;

export function getPasswordRequirements(password) {
  return [
    { key: 'length', label: `At least ${PASSWORD_MIN_LENGTH} characters`, passed: password.length >= PASSWORD_MIN_LENGTH },
    { key: 'letter', label: 'Includes a letter (A-Z)', passed: /[A-Za-z]/.test(password) },
    { key: 'number', label: 'Includes a number (0-9)', passed: /\d/.test(password) },
    { key: 'special', label: 'Includes a special character', passed: /[^\w\s]/.test(password) },
  ];
}