import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/preact';
import { FormButton } from '@/components/compose/button/form.button';

describe('Components | Compose | FormButton', () => {
  it('renders label and triggers click', () => {
    const handleClick = vi.fn();
    render(
      <FormButton
        onClick={handleClick}
        color='primary'
        label='Submit'
        icon='check'
      />
    );
    const button = screen.getByRole('button');
    expect(screen.getByText('Submit')).toBeInTheDocument();
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalled();
  });
});
