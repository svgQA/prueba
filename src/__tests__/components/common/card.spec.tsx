import { render } from '@testing-library/preact';
import { describe, it, expect } from 'vitest';
import { Card } from '@/components/common/card/card';

describe('Components | Common | Card', () => {
  it('applies default styling and renders children', () => {
    const { getByText, container } = render(
      <Card id='summary-card'>
        <span>Card content</span>
      </Card>
    );

    expect(getByText('Card content')).toBeInTheDocument();
    const wrapper = container.querySelector('#summary-card');
    expect(wrapper).toHaveClass('rounded-lg');
    expect(wrapper).toHaveClass('border-2');
    expect(wrapper).toHaveClass('bg-white');
  });

  it('combines customization flags correctly', () => {
    const { container } = render(
      <Card
        id='custom-card'
        rounded={false}
        shadow
        borderless
        transparent
        maxWidth='max-w-md'
        color='text-primary'
      >
        <span>content</span>
      </Card>
    );

    const wrapper = container.querySelector('#custom-card');
    expect(wrapper).not.toHaveClass('rounded-lg');
    expect(wrapper).toHaveClass('border-0');
    expect(wrapper).toHaveClass('shadow-md');
    expect(wrapper).toHaveClass('bg-transparent');
    expect(wrapper).toHaveClass('max-w-md');
    expect(wrapper).toHaveClass('text-primary');
  });
});
