import { cleanup, fireEvent, render, screen } from '@testing-library/preact';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useState } from 'preact/hooks';
import { CustomSelector } from '@/components/common/custom-selector/custom-selector';

const tMock = vi.fn((key: string) => key);

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: tMock }),
}));

const options = [
  { label: 'Alpha', value: 1 },
  { label: 'Beta', value: 2 },
  { label: 'Gamma', value: 3 },
  { label: 'Delta', value: 4 },
];

type Option = (typeof options)[number];

const ControlledCustomSelector = (props: any) => {
  const [value, setValue] = useState<Option[]>(props.initialValue ?? []);
  return (
    <CustomSelector
      {...props}
      value={value}
      onChange={(next: Option[]) => {
        setValue(next);
        props.onValueChange?.(next);
      }}
    />
  );
};

describe('Components | Common | CustomSelector', () => {
  beforeEach(() => {
    tMock.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it('translates label and placeholder, filters options and supports keyboard usage', () => {
    const portalRoot = document.createElement('div');
    document.body.appendChild(portalRoot);
    const handleChange = vi.fn();

    const { container } = render(
      <CustomSelector
        label='selector.label'
        placeholder='selector.placeholder'
        name='selector'
        options={options}
        onChange={handleChange}
        meta={{ touched: true, error: 'selector.error' } as any}
        menuPortalTarget={portalRoot}
      />
    );

    const input = container.querySelector('input') as HTMLInputElement;
    expect(tMock).toHaveBeenCalledWith('selector.label');
    expect(input.placeholder).toBe('selector.placeholder');

    fireEvent.change(input, { target: { value: 'a' } });
    const alphaOption = screen.getByRole('button', { name: 'Alpha' });
    expect(alphaOption.className).toContain('bg-blue-100');

    fireEvent.keyDown(document, { key: 'ArrowDown' });
    const betaOption = screen.getByRole('button', { name: 'Beta' });
    expect(betaOption.className).toContain('bg-blue-100');
    expect(alphaOption.className).not.toContain('bg-blue-100');

    fireEvent.keyDown(document, { key: 'ArrowUp' });
    fireEvent.keyDown(document, { key: 'ArrowUp' });
    const deltaOption = screen.getByRole('button', { name: 'Delta' });
    expect(deltaOption.className).toContain('bg-blue-100');

    fireEvent.keyDown(document, { key: 'Enter' });
    expect(handleChange).toHaveBeenCalledWith([{ label: 'Delta', value: 4 }]);
    expect(input.value).toBe('');
    expect(screen.queryByRole('button', { name: 'Alpha' })).toBeNull();

    expect(screen.getAllByText('selector.error')).toHaveLength(2);

    fireEvent.change(input, { target: { value: 'a' } });
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole('button', { name: 'Alpha' })).toBeNull();

    portalRoot.remove();
  });

  it('allows multi selection, chip removal and select-all toggling', () => {
    const portalRoot = document.createElement('div');
    document.body.appendChild(portalRoot);
    const onValueChange = vi.fn();

    const { container } = render(
      <ControlledCustomSelector
        name='selector'
        options={options}
        multiple
        onValueChange={onValueChange}
        menuPortalTarget={portalRoot}
      />
    );

    const input = container.querySelector('input') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'a' } });
    fireEvent.mouseDown(screen.getByRole('button', { name: 'Alpha' }));
    expect(onValueChange).toHaveBeenCalledWith([{ label: 'Alpha', value: 1 }]);
    expect(screen.getByText('Alpha')).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'g' } });
    fireEvent.mouseDown(screen.getByRole('button', { name: 'Gamma' }));
    expect(onValueChange).toHaveBeenLastCalledWith([
      { label: 'Alpha', value: 1 },
      { label: 'Gamma', value: 3 },
    ]);

    const removeButtons = screen.getAllByRole('button', { name: '×' });
    fireEvent.click(removeButtons[0]);
    expect(onValueChange).toHaveBeenLastCalledWith([
      { label: 'Gamma', value: 3 },
    ]);
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'a' } });
    fireEvent.mouseDown(
      screen.getByRole('button', { name: 'Seleccionar todos' })
    );
    expect(onValueChange).toHaveBeenLastCalledWith([
      { label: 'Todos', value: -1 },
    ]);
    expect(screen.getByText('Todos')).toBeInTheDocument();

    portalRoot.remove();
  });

  it('omits the select-all control when disabled and applies custom classes', () => {
    const portalRoot = document.createElement('div');
    document.body.appendChild(portalRoot);

    const { container } = render(
      <CustomSelector
        name='selector'
        options={options}
        multiple
        showSelectAll={false}
        dropdownClassName='custom-dropdown'
        optionClassName='custom-option'
        menuPortalTarget={portalRoot}
      />
    );

    const input = container.querySelector('input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'a' } });

    expect(
      screen.queryByRole('button', { name: 'Seleccionar todos' })
    ).toBeNull();

    const option = screen.getByRole('button', { name: 'Alpha' });
    expect(option.className).toContain('custom-option');
    const dropdown = portalRoot.querySelector('div.custom-dropdown');
    expect(dropdown).not.toBeNull();

    portalRoot.remove();
  });
});
