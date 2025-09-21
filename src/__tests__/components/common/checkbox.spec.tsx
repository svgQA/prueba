import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/preact';
import { Checkbox } from '@/components/common/checkbox/checkbox';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (str: string) => str }),
}));

describe('Components | Common | Checkbox', () => {
  it('renders label and triggers change', () => {
    const handleChange = vi.fn();
    render(
      <Checkbox
        id='test-checkbox'
        name='test'
        label='check label'
        options={[
          { label: 'One', value: '1' },
          { label: 'Two', value: '2' },
        ]}
        value={{}}
        onChange={handleChange}
      />
    );
    expect(screen.getByText('check label')).toBeInTheDocument();
    const option = screen.getByLabelText('Two');
    fireEvent.click(option);
    expect(handleChange).toHaveBeenCalled();
  });
});
