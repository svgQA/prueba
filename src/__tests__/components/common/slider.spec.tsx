import { fireEvent, render, screen } from '@testing-library/preact';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Slider } from '@/components/common/slider/slider';

const tMock = vi.fn((key: string) => `t:${key}`);

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: tMock }),
}));

describe('Components | Common | Slider', () => {
  beforeEach(() => {
    tMock.mockClear();
  });

  it('translates the label and displays the current value by default', () => {
    const { container } = render(
      <Slider label='slider.label' value={45} onChange={vi.fn()} />
    );

    expect(screen.getByText('t:slider.label: 45')).toBeInTheDocument();
    expect(tMock).toHaveBeenCalledWith('slider.label');

    const fill = container.querySelector('.relative div') as HTMLDivElement;
    expect(fill.style.width).toBe('45%');
  });

  it('hides the numeric value when showValue is false', () => {
    render(
      <Slider
        label='slider.hidden'
        value={30}
        showValue={false}
        onChange={vi.fn()}
      />
    );

    const label = screen.getByText(/t:slider.hidden:/);
    expect(label).toHaveTextContent('t:slider.hidden:');
    expect(label).not.toHaveTextContent('30');
  });

  it('calls onChange with the selected value when interacting with the slider', () => {
    const handleChange = vi.fn();
    render(<Slider value={10} onChange={handleChange} />);

    const input = screen.getByRole('slider');
    fireEvent.change(input, { target: { value: '27' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(27);
  });

  it('disables interactions and preserves the previous value when disabled', () => {
    const handleChange = vi.fn();
    const { container } = render(
      <Slider value={70} onChange={handleChange} disabled />
    );

    const input = screen.getByRole('slider');
    expect(input).toBeDisabled();

    fireEvent.change(input, { target: { value: '40' } });
    expect(handleChange).not.toHaveBeenCalled();

    const fill = container.querySelector('.relative div') as HTMLDivElement;
    expect(fill.className).toContain('bg-gray-400');
    expect(fill.style.width).toBe('70%');
  });
});
