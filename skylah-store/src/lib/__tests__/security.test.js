import { describe, expect, it } from 'vitest';
import { isLikelyFirebaseOobCode, isSafeHttpUrl, sanitizeAuthError } from '../security';

describe('security helpers', () => {
  describe('isSafeHttpUrl', () => {
    it('accepts http and https urls', () => {
      expect(isSafeHttpUrl('https://example.com/avatar.png')).toBe(true);
      expect(isSafeHttpUrl('http://example.com/avatar.png')).toBe(true);
    });

    it('rejects javascript/data/file protocols and invalid urls', () => {
      expect(isSafeHttpUrl('javascript:alert(1)')).toBe(false);
      expect(isSafeHttpUrl('data:image/svg+xml;base64,AAA')).toBe(false);
      expect(isSafeHttpUrl('file:///etc/passwd')).toBe(false);
      expect(isSafeHttpUrl('not-a-url')).toBe(false);
      expect(isSafeHttpUrl('')).toBe(false);
    });
  });

  describe('sanitizeAuthError', () => {
    it('maps known firebase errors to user-safe messages', () => {
      expect(sanitizeAuthError({ code: 'auth/invalid-email' })).toBe('Please enter a valid email address.');
      expect(sanitizeAuthError({ code: 'auth/wrong-password' })).toBe('Incorrect email or password.');
    });

    it('does not leak unknown internal error details', () => {
      expect(sanitizeAuthError({ code: 'auth/custom-internal-error', message: 'db down trace xyz' })).toBe(
        'Something went wrong. Please try again.'
      );
    });
  });

  describe('isLikelyFirebaseOobCode', () => {
    it('accepts code-shaped values', () => {
      expect(isLikelyFirebaseOobCode('AbCdEfGhIjKlMnOpQrStUvWxYz_1234567890')).toBe(true);
    });

    it('rejects short/unsafe values', () => {
      expect(isLikelyFirebaseOobCode('short')).toBe(false);
      expect(isLikelyFirebaseOobCode('bad code with spaces')).toBe(false);
      expect(isLikelyFirebaseOobCode('')).toBe(false);
    });
  });
});
