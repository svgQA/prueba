import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/preact';
import { ThemeButton } from '@/components/compose/button/theme.button';
import { localStorage } from '@/utils/storage';
import { toggleTheme } from '@/components/compose/button/signal.theme';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (str: string) => str }),
}));

vi.mock('@/utils/storage', () => ({
  localStorage: { get: vi.fn(), set: vi.fn() },
}));

vi.mock('@/components/compose/button/signal.theme', () => {
  const toggleTheme = vi.fn();
  return { toggleTheme, getTheme: { value: true }, setTheme: vi.fn() };
});

describe('Components | Compose | ThemeButton', () => {
  it('toggles theme and saves preference', () => {
    render(<ThemeButton />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(toggleTheme).toHaveBeenCalled();
    expect(localStorage.set).toHaveBeenCalledWith('theme', true);
    expect(document.body.classList.contains('dark')).toBe(true);
  });
});
