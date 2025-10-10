import { render, screen } from '@testing-library/preact';
import { describe, expect, it } from 'vitest';
import { ProgressBar } from '@/components/common/progress/progress';

describe('Components | Common | ProgressBar', () => {
  it('renders the current progress percentage in the text label', () => {
    render(<ProgressBar progress={68} />);

    expect(screen.getByText('68%')).toBeInTheDocument();
  });

  it('applies the width based on the received progress value', () => {
    const { container, rerender } = render(<ProgressBar progress={25} />);

    const bar = container.querySelector('.bg-blue-600') as HTMLDivElement;
    expect(bar.style.width).toBe('25%');

    rerender(<ProgressBar progress={85} />);

    expect(bar.style.width).toBe('85%');
    expect(screen.getByText('85%')).toBeInTheDocument();
  });
});
