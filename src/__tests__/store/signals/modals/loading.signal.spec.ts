import { describe, expect, it, beforeEach } from 'vitest';
import {
  closeLoading,
  getStatusLoading,
  openLoading,
  toggleLoading,
} from '@/store/signals/modals/loading.signal';

beforeEach(() => {
  closeLoading();
});

describe('Store | Signals | Modals | Loading', () => {
  it('is disabled by default', () => {
    expect(getStatusLoading.value).toBe(false);
  });

  it('can be enabled and disabled explicitly', () => {
    openLoading();
    expect(getStatusLoading.value).toBe(true);

    closeLoading();
    expect(getStatusLoading.value).toBe(false);
  });

  it('toggles the loading flag', () => {
    toggleLoading();
    expect(getStatusLoading.value).toBe(true);

    toggleLoading();
    expect(getStatusLoading.value).toBe(false);
  });
});
