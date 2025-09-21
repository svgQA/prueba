import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/preact';
import { Radio } from '@/components/common/radio/radio';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (str: string) => str }),
}));

describe('Components | Common | Radio', () => {
  it('renders label and triggers change', () => {
    const handleChange = vi.fn();
    render(
      <Radio
        id='test-radio'
        name='test'
        label='radio label'
        options={[
          { label: 'One', value: '1' },
          { label: 'Two', value: '2' },
        ]}
        value='1'
        onChange={handleChange}
      />
    );
    expect(screen.getByText('radio label')).toBeInTheDocument();
    const option = screen.getByLabelText('Two');
    fireEvent.click(option);
    expect(handleChange).toHaveBeenCalled();
  });
});
