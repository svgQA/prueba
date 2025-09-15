import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/preact';
import { Input } from '@/components/common/input/input';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (str: string) => str }),
}));

describe('Components | Common | Input', () => {
  it('renders label and handles input', () => {
    const handleChange = vi.fn();
    render(
      <Input
        id='test-input'
        name='test'
        label='test label'
        placeholder='placeholder text'
        value=''
        onChange={handleChange}
      />
    );
    expect(screen.getByText('test label')).toBeInTheDocument();
    const field = screen.getByPlaceholderText(
      'placeholder text'
    ) as HTMLInputElement;
    fireEvent.change(field, { target: { value: 'Hello' } });
    expect(handleChange).toHaveBeenCalled();
  });
});
