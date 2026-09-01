import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
  process.env = { ...ORIGINAL_ENV };
  vi.resetModules();
});
afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe('isInternalRequest', () => {
  it('devuelve false si INTERNAL_API_KEY no está configurada', () => {
    delete process.env.INTERNAL_API_KEY;
    const { isInternalRequest } = require('./internalAuth');
    expect(isInternalRequest({ headers: { 'x-internal-key': 'lo-que-sea' } })).toBe(false);
  });

  it('devuelve false si el header no coincide', () => {
    process.env.INTERNAL_API_KEY = 'secreto-real';
    const { isInternalRequest } = require('./internalAuth');
    expect(isInternalRequest({ headers: { 'x-internal-key': 'secreto-falso' } })).toBe(false);
  });

  it('devuelve false si el header no viene', () => {
    process.env.INTERNAL_API_KEY = 'secreto-real';
    const { isInternalRequest } = require('./internalAuth');
    expect(isInternalRequest({ headers: {} })).toBe(false);
  });

  it('devuelve true si el header coincide exactamente', () => {
    process.env.INTERNAL_API_KEY = 'secreto-real';
    const { isInternalRequest } = require('./internalAuth');
    expect(isInternalRequest({ headers: { 'x-internal-key': 'secreto-real' } })).toBe(true);
  });
});
