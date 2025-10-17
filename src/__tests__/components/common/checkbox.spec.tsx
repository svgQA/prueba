import { fireEvent, render, screen } from '@testing-library/preact';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Checkbox } from '@/components/common/checkbox/checkbox';

const tMock = vi.fn((key: string) => `t:${key}`);

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: tMock }),
}));

describe('Components | Common | Checkbox', () => {
  const options = [
    { label: 'checkbox.first', value: 'first' },
    { label: 'checkbox.second', value: 'second' },
  ];

  beforeEach(() => {
    tMock.mockClear();
  });

  it('translates the group label and each option label', () => {
    render(
      <Checkbox
        id='checkbox'
        name='choices'
        label='checkbox.group'
        options={options}
        value={{}}
      />
    );

    expect(screen.getByText('t:checkbox.group')).toBeInTheDocument();
    expect(screen.getByLabelText('t:checkbox.first')).toBeInTheDocument();
    expect(screen.getByLabelText('t:checkbox.second')).toBeInTheDocument();
    expect(tMock).toHaveBeenCalledWith('checkbox.group');
    expect(tMock).toHaveBeenCalledWith('checkbox.first');
    expect(tMock).toHaveBeenCalledWith('checkbox.second');
  });

  it('marks options as checked based on the value map and emits change events', () => {
    const handleChange = vi.fn();
    render(
      <Checkbox
        id='checkbox-selected'
        name='choices'
        options={options}
        value={{ second: true }}
        onChange={handleChange}
      />
    );

    const first = screen.getByLabelText('t:checkbox.first') as HTMLInputElement;
    const second = screen.getByLabelText(
      't:checkbox.second'
    ) as HTMLInputElement;

    expect(first.checked).toBe(false);
    expect(second.checked).toBe(true);
    expect(second.dataset.value).toBe('second');

    fireEvent.click(first);
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(
      (handleChange.mock.calls[0][0].target as HTMLInputElement).dataset.value
    ).toBe('first');
  });

  it('applies required and disabled flags to every checkbox control', () => {
    render(
      <Checkbox
        id='checkbox-flags'
        name='choices'
        options={options}
        value={{}}
        required
        disabled
      />
    );

    const inputs = options.map(
      (option) => screen.getByLabelText(`t:${option.label}`) as HTMLInputElement
    );

    for (const input of inputs) {
      expect(input).toBeRequired();
      expect(input).toBeDisabled();
    }
  });
});
