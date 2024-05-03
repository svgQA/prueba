import { expect, afterEach } from 'vitest';
import { cleanup, renderHook } from '@testing-library/preact';
import * as matchers from '@testing-library/jest-dom/matchers';
import { useState } from 'preact/hooks';

expect.extend(matchers);

afterEach(() => {
  renderHook(() => useState());
  cleanup();
});
