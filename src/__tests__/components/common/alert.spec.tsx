import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/preact';
import { Alert } from '@/components/common/alert/alert';

describe('Components | Common | Alert', () => {
  it('renders with provided id', () => {
    const { container } = render(<Alert id='alert-id' name='alert-name' />);
    expect(container.querySelector('#alert-id')).toBeInTheDocument();
  });
});
