import { cleanup, fireEvent, render, screen } from '@testing-library/preact';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useState } from 'preact/hooks';
import { MultipleInput } from '@/components/common/multi/multi';

const tMock = vi.fn((key: string) => key);

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: tMock }),
}));

const ControlledMultipleInput = (props: any) => {
  const [value, setValue] = useState(props.initialValue ?? []);
  return (
    <MultipleInput
      {...props}
      value={value}
      onChange={(next: any, name?: string) => {
        setValue(next);
        props.onValueChange?.(next, name);
      }}
    />
  );
};

describe('Components | Common | MultipleInput', () => {
  beforeEach(() => {
    tMock.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it('adds items on Enter, resets the field and removes chips on demand', () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <ControlledMultipleInput
        id='multi-input'
        name='participants'
        onValueChange={onValueChange}
      />
    );

    const input = container.querySelector('input') as HTMLInputElement;
    expect(tMock).toHaveBeenCalledWith('p_type_and_press_enter');

    fireEvent.change(input, { target: { value: 'Alice' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onValueChange).toHaveBeenLastCalledWith(
      [{ label: 'Alice', value: 0 }],
      'participants'
    );
    expect(input.value).toBe('');
    expect(screen.getByText('Alice')).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'Bob' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onValueChange).toHaveBeenLastCalledWith(
      [
        { label: 'Alice', value: 0 },
        { label: 'Bob', value: 1 },
      ],
      'participants'
    );
    expect(screen.getByText('Bob')).toBeInTheDocument();

    const removeIcons = container.querySelectorAll('.vx-icon-192');
    fireEvent.click(removeIcons[0]);
    expect(onValueChange).toHaveBeenLastCalledWith(
      [{ label: 'Bob', value: 1 }],
      'participants'
    );
    expect(screen.queryByText('Alice')).not.toBeInTheDocument();
  });

  it('renders custom elements, triggers the auxiliary button and honors bottom layout', () => {
    const onValueChange = vi.fn();
    const onSelect = vi.fn();
    const { container } = render(
      <ControlledMultipleInput
        id='multi-custom'
        name='participants'
        initialValue={[{ label: 'Charlie', value: 3 }]}
        getElement={(item: any) => (
          <div data-testid='custom-element'>{item.label}</div>
        )}
        bottom
        button
        onSelect={onSelect}
        onValueChange={onValueChange}
        buttonIcon='250'
        {...({ buttonLabel: 'multi.add' } as any)}
      />
    );

    expect(screen.getByTestId('custom-element')).toHaveTextContent('Charlie');

    const closeIcon = container.querySelector('.vx-icon-192') as HTMLElement;
    fireEvent.click(closeIcon);
    expect(onValueChange).toHaveBeenLastCalledWith([], 'participants');
    expect(screen.queryByTestId('custom-element')).not.toBeInTheDocument();

    const actionButton = container.querySelector(
      'button[name="btn-input-action"]'
    ) as HTMLButtonElement;
    fireEvent.click(actionButton);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
