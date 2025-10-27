import { cleanup, fireEvent, render, screen } from '@testing-library/preact';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SearchableSelect } from '@/components/common/searchable-select/searchable-select';
import { useState } from 'preact/hooks';

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

const ControlledSearchableSelect = (props: any) => {
  const [value, setValue] = useState<Option[]>(props.initialValue ?? []);
  return (
    <SearchableSelect
      {...props}
      value={value}
      onChange={(next: Option[]) => {
        setValue(next);
        props.onValueChange?.(next);
      }}
    />
  );
};

describe('Components | Common | SearchableSelect', () => {
  beforeEach(() => {
    tMock.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it('translates label and placeholder, filters options and supports keyboard control', () => {
    const handleChange = vi.fn();
    const { container } = render(
      <SearchableSelect
        label='searchable.label'
        placeholder='searchable.placeholder'
        name='searchable'
        options={options}
        onChange={handleChange}
        meta={{ touched: true, error: 'searchable.error' } as any}
      />
    );

    const input = container.querySelector('input') as HTMLInputElement;
    expect(tMock).toHaveBeenCalledWith('searchable.label');
    expect(input.placeholder).toBe('searchable.placeholder');

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

    expect(screen.getByText('searchable.error')).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'a' } });
    expect(screen.getByRole('button', { name: 'Alpha' })).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole('button', { name: 'Alpha' })).toBeNull();
  });

  it('manages multi selection, removal and the select-all shortcut', () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <ControlledSearchableSelect
        name='searchable'
        options={options}
        multiple
        onValueChange={onValueChange}
      />
    );

    const input = container.querySelector('input') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'a' } });
    fireEvent.click(screen.getByRole('button', { name: 'Alpha' }));
    expect(onValueChange).toHaveBeenLastCalledWith([
      { label: 'Alpha', value: 1 },
    ]);
    expect(screen.getByText('Alpha')).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'b' } });
    fireEvent.click(screen.getByRole('button', { name: 'Beta' }));
    expect(onValueChange).toHaveBeenLastCalledWith([
      { label: 'Alpha', value: 1 },
      { label: 'Beta', value: 2 },
    ]);
    expect(screen.getByText('Beta')).toBeInTheDocument();

    const removeButtons = screen.getAllByRole('button', { name: '×' });
    fireEvent.click(removeButtons[0]);
    expect(onValueChange).toHaveBeenLastCalledWith([
      { label: 'Beta', value: 2 },
    ]);
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'a' } });
    fireEvent.click(screen.getByRole('button', { name: 'Seleccionar todos' }));
    expect(onValueChange).toHaveBeenLastCalledWith([
      { label: 'Todos', value: -1 },
    ]);
    expect(screen.getByText('Todos')).toBeInTheDocument();
  });

  it('shows deselect-all when every option is active', () => {
    const onValueChange = vi.fn();
    render(
      <ControlledSearchableSelect
        name='searchable'
        options={options}
        multiple
        initialValue={options}
        onValueChange={onValueChange}
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'a' } });

    const deselectButton = screen.getByRole('button', {
      name: 'Deseleccionar todos',
    });
    fireEvent.click(deselectButton);
    expect(onValueChange).toHaveBeenLastCalledWith([]);
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument();
  });
});
