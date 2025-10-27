import { render } from '@testing-library/preact';
import { act } from 'preact/test-utils';
import { describe, expect, it, afterEach } from 'vitest';
import { Loading } from '@/components/common/loading/loading';
import {
  closeLoading,
  getStatusLoading,
  openLoading,
  toggleLoading,
} from '@/store/signals/modals/loading.signal';

afterEach(() => {
  closeLoading();
});

describe('Components | Common | Loading', () => {
  it('renders an invisible overlay when the loading signal is disabled', () => {
    closeLoading();
    const { container } = render(<Loading />);

    const overlay = container.querySelector('div');
    expect(overlay).toBeTruthy();
    expect(overlay!.className).toContain('invisible');
    expect(getStatusLoading.value).toBe(false);
  });

  it('shows the overlay when the loading signal is enabled', () => {
    const { container } = render(<Loading />);

    act(() => {
      openLoading();
    });

    const overlay = container.querySelector('div');
    expect(getStatusLoading.value).toBe(true);
    expect(overlay!.className).toContain('visible');
    expect(container.querySelector('.loader')).toBeTruthy();
  });

  it('toggles the signal visibility using the helper functions', () => {
    const { container } = render(<Loading />);
    const overlay = container.querySelector('div')!;

    act(() => {
      toggleLoading();
    });
    expect(getStatusLoading.value).toBe(true);
    expect(overlay.className).toContain('visible');

    act(() => {
      closeLoading();
    });
    expect(getStatusLoading.value).toBe(false);
    expect(overlay.className).toContain('invisible');
  });
});
