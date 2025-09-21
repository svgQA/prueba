import { fireEvent, render, screen } from '@testing-library/preact';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Radio } from '@/components/common/radio/radio';

const tMock = vi.fn((key: string) => `t:${key}`);

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: tMock }),
}));

describe('Components | Common | Radio', () => {
  const options = [
    { label: 'radio.first', value: 'first' },
    { label: 'radio.second', value: 'second' },
  ];

  beforeEach(() => {
    tMock.mockClear();
  });

  it('translates the group label and each radio option', () => {
    render(
      <Radio
        id='radio'
        name='choices'
        label='radio.group'
        options={options}
        value='first'
      />
    );

    expect(screen.getByText('t:radio.group')).toBeInTheDocument();
    expect(screen.getByLabelText('t:radio.first')).toBeInTheDocument();
    expect(screen.getByLabelText('t:radio.second')).toBeInTheDocument();
    expect(tMock).toHaveBeenCalledWith('radio.group');
    expect(tMock).toHaveBeenCalledWith('radio.first');
    expect(tMock).toHaveBeenCalledWith('radio.second');
  });

  it('selects the radio matching the provided value and notifies on change', () => {
    const handleChange = vi.fn();
    render(
      <Radio
        id='radio-selected'
        name='choices'
        options={options}
        value='second'
        onChange={handleChange}
      />
    );

    const first = screen.getByLabelText('t:radio.first') as HTMLInputElement;
    const second = screen.getByLabelText('t:radio.second') as HTMLInputElement;

    expect(first.checked).toBe(false);
    expect(second.checked).toBe(true);

    fireEvent.click(first);
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect((handleChange.mock.calls[0][0].target as HTMLInputElement).value).toBe('first');
  });

  it('respects the required and disabled flags on each radio input', () => {
    render(
      <Radio
        id='radio-flags'
        name='choices'
        options={options}
        value='first'
        required
        disabled
      />
    );

    const inputs = options.map((option) =>
      screen.getByLabelText(`t:${option.label}`) as HTMLInputElement
    );

    for (const input of inputs) {
      expect(input).toBeRequired();
      expect(input).toBeDisabled();
    }
  });
});
