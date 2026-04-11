import { describe, expect, it } from 'vitest';
import { getPasswordRequirements, PASSWORD_MIN_LENGTH, PASSWORD_RULE } from '../authPolicy';

describe('auth password policy', () => {
  it('enforces minimum length constant', () => {
    expect(PASSWORD_MIN_LENGTH).toBe(6);
  });

  it('accepts valid passwords that satisfy all required character classes', () => {
    expect(PASSWORD_RULE.test('Abcdef1!')).toBe(true);
    expect(PASSWORD_RULE.test('StrongPass9$')).toBe(true);
  });

  it('rejects passwords missing required classes or too short', () => {
    expect(PASSWORD_RULE.test('abc')).toBe(false);
    expect(PASSWORD_RULE.test('abcdef!')).toBe(false);
    expect(PASSWORD_RULE.test('abcdef1')).toBe(false);
    expect(PASSWORD_RULE.test('ABC1!')).toBe(false);
  });

  it('returns requirement checklist states', () => {
    const requirements = getPasswordRequirements('abc1!');
    const lengthRule = requirements.find((item) => item.key === 'length');
    const letterRule = requirements.find((item) => item.key === 'letter');
    const numberRule = requirements.find((item) => item.key === 'number');
    const specialRule = requirements.find((item) => item.key === 'special');

    expect(lengthRule?.passed).toBe(false);
    expect(letterRule?.passed).toBe(true);
    expect(numberRule?.passed).toBe(true);
    expect(specialRule?.passed).toBe(true);
  });
});
