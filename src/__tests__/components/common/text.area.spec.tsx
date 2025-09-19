import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/preact';
import { TextArea } from '@/components/common/text.area/text.area';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (str: string) => str }),
}));

describe('Components | Common | TextArea', () => {
  it('renders label and handles input', () => {
    const handleChange = vi.fn();
    render(
      <TextArea
        id='test-textarea'
        name='test'
        label='text label'
        placeholder='write here'
        value=''
        onChange={handleChange}
      />
    );
    expect(screen.getByText('text label')).toBeInTheDocument();
    const field = screen.getByPlaceholderText(
      'write here'
    ) as HTMLTextAreaElement;
    fireEvent.change(field, { target: { value: 'hello' } });
    expect(handleChange).toHaveBeenCalled();
  });
});
