export function isSafeHttpUrl(value) {
  if (!value || typeof value !== 'string') return false;

  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function sanitizeAuthError(error) {
  const code = error?.code || '';

  const knownMessages = {
    'auth/email-already-in-use': 'This email is already registered.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/missing-email': 'Please enter your email address.',
    'auth/weak-password': 'Use a stronger password that matches all requirements.',
    'auth/user-not-found': 'No account found with that email.',
    'auth/wrong-password': 'Incorrect email or password.',
    'auth/invalid-credential': 'Incorrect email or password.',
    'auth/too-many-requests': 'Too many attempts. Please wait and try again.',
    'auth/network-request-failed': 'Network error. Check your internet and try again.',
    'auth/invalid-action-code': 'This verification link is invalid or has expired.',
    'auth/expired-action-code': 'This verification link has expired. Request a new one.',
  };

  return knownMessages[code] || 'Something went wrong. Please try again.';
}

export function isLikelyFirebaseOobCode(value) {
  if (!value || typeof value !== 'string') return false;
  return /^[A-Za-z0-9_-]{20,}$/.test(value);
}