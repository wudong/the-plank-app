import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, expect, vi } from 'vitest';
import type { Assertion, AsymmetricMatchersContaining, VitestUtils } from 'vitest';

declare global {
  var expect: {
    <T = unknown>(actual: T): Assertion<T>;
    extend(matchers: Record<string, unknown>): void;
    assertions(count: number): void;
    hasAssertions(): void;
    anything(): AsymmetricMatchersContaining;
    any(constructor: unknown): AsymmetricMatchersContaining;
  };
  var vi: VitestUtils;
}

// Make Vitest's functions global
globalThis.expect = expect;
globalThis.vi = vi;

// Automatically cleanup after each test
afterEach(() => {
  cleanup();
});
