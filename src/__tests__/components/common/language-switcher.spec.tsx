import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/preact';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';

const changeLanguage = vi.fn();
let currentLanguage = 'es-ES';

const CustomSwitcherMock = vi.fn(
  ({ value, onChange, borderless, options }) => (
    <button
      type='button'
      data-testid='custom-switcher'
      data-borderless={borderless}
      onClick={() => onChange?.('en')}
    >
      {value}
      {options?.map((option) => option.value).join(',')}
    </button>
  )
);

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: {
      language: currentLanguage,
      changeLanguage,
    },
  }),
}));

vi.mock('@/components/common/CustomSwitcher', () => ({
  CustomSwitcher: (props: any) => CustomSwitcherMock(props),
}));

describe('Components | Common | LanguageSwitcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    currentLanguage = 'es-ES';
  });

  it('passes the current language value and available options to the switcher', () => {
    render(<LanguageSwitcher />);

    expect(CustomSwitcherMock).toHaveBeenCalledTimes(1);
    const props = CustomSwitcherMock.mock.calls[0][0];
    expect(props.value).toBe('es');
    expect(props.options).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ value: 'es', label: 'Español' }),
        expect.objectContaining({ value: 'en', label: 'English' }),
      ])
    );
  });

  it('triggers the language change when a new option is selected', () => {
    render(<LanguageSwitcher />);

    const switcher = screen.getByTestId('custom-switcher');
    fireEvent.click(switcher);

    expect(changeLanguage).toHaveBeenCalledWith('en');
  });

  it('forwards the borderless prop to the underlying switcher', () => {
    render(<LanguageSwitcher borderless />);

    const switcher = screen.getByTestId('custom-switcher');
    expect(switcher.dataset.borderless).toBe('true');
  });

  it('normalises english locales to the en option', () => {
    currentLanguage = 'en-US';
    render(<LanguageSwitcher />);

    const switcher = screen.getByTestId('custom-switcher');
    expect(switcher.textContent?.trim().startsWith('en')).toBe(true);
  });
});
