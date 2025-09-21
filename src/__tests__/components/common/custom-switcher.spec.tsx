import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/preact';
import { CustomSwitcher } from '@/components/common/CustomSwitcher';

describe('Components | Common | CustomSwitcher', () => {
  const options = [
    { value: 'es', label: 'Español', sIcon: '🇪🇸' },
    { value: 'en', label: 'English', sIcon: '🇬🇧' },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns null when no options are provided', () => {
    const { container } = render(<CustomSwitcher />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the current option label and toggles the dropdown', () => {
    render(<CustomSwitcher options={options} value='es' />);

    const toggleButton = screen.getByRole('button', { name: /Español/i });
    expect(toggleButton).toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(screen.getByRole('button', { name: /English/i })).toBeInTheDocument();
  });

  it('calls onChange with the selected option and closes the list', () => {
    const handleChange = vi.fn();
    render(
      <CustomSwitcher options={options} value='es' onChange={handleChange} />
    );

    const toggleButton = screen.getByRole('button', { name: /Español/i });
    fireEvent.click(toggleButton);

    const englishOption = screen.getByRole('button', { name: /English/i });
    fireEvent.click(englishOption);

    expect(handleChange).toHaveBeenCalledWith('en');
    expect(screen.queryByRole('button', { name: /English/i })).not.toBeInTheDocument();
  });

  it('closes the dropdown when clicking outside', () => {
    render(<CustomSwitcher options={options} value='es' />);

    const toggleButton = screen.getByRole('button', { name: /Español/i });
    fireEvent.click(toggleButton);
    expect(screen.getByRole('button', { name: /English/i })).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    expect(screen.queryByRole('button', { name: /English/i })).not.toBeInTheDocument();
  });

  it('applies the borderless styles to the trigger button', () => {
    render(<CustomSwitcher options={options} value='es' borderless />);

    const toggleButton = screen.getByRole('button');
    expect(toggleButton.className).toMatch(/border-none/);
  });
});
