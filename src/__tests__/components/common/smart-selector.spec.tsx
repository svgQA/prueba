import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SmartSelector, type IOption } from '@/components/common/smart-selector/smart-select';

const tMock = vi.fn((key: string) => key);
const useFieldMock = vi.fn();

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: tMock }),
}));

vi.mock('react-final-form', () => ({
  useField: (name: string) => useFieldMock(name),
}));

type FieldValue = IOption | IOption[] | string | undefined;

const createFieldState = (initialValue: FieldValue = undefined) => {
  const state = {
    input: {
      value: initialValue,
      onChange: vi.fn((next: FieldValue) => {
        state.input.value = next;
      }),
    },
  };
  useFieldMock.mockReturnValue(state);
  return state;
};

const options: IOption[] = [
  { label: 'Alpha', value: 1 },
  { label: 'Beta', value: 2 },
  { label: 'Gamma', value: 3 },
];

describe('Components | Common | SmartSelector', () => {
  beforeEach(() => {
    tMock.mockClear();
    useFieldMock.mockReset();
  });

  afterEach(() => {
    cleanup();
  });

  it('translates label/placeholder, filters options and supports single selection removal', async () => {
    const field = createFieldState('');
    const handleChange = vi.fn();

    const { container } = render(
      <SmartSelector
        name='smart'
        label='smart.label'
        placeholder='smart.placeholder'
        options={options}
        onChange={handleChange}
      />
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.placeholder).toBe('smart.placeholder');
    expect(tMock).toHaveBeenCalledWith('smart.label');
    expect(tMock).toHaveBeenCalledWith('smart.placeholder');

    const user = userEvent.setup();

    input.focus();
    fireEvent.focus(input);
    await waitFor(() => {
      expect(document.querySelector('.vox-scroll-design')).not.toBeNull();
    });

    const optionByLabel = (label: string) => {
      const dropdown = document.querySelector(
        '.vox-scroll-design'
      ) as HTMLElement | null;
      if (!dropdown) return undefined;
      return Array.from(dropdown.querySelectorAll('div')).find(
        (node) => node.textContent?.trim() === label
      ) as HTMLElement | undefined;
    };

    const alphaOption = optionByLabel('Alpha');
    expect(alphaOption).toBeTruthy();

    await user.clear(input);
    await user.type(input, 'ga');
    await waitFor(() => {
      expect(optionByLabel('Gamma')).toBeTruthy();
    });
    expect(optionByLabel('Alpha')).toBeUndefined();

    const gammaOption = optionByLabel('Gamma');
    expect(gammaOption).toBeTruthy();
    fireEvent.mouseDown(gammaOption as HTMLElement);
    expect(field.input.onChange).toHaveBeenCalledWith(options[2]);
    expect(handleChange).toHaveBeenCalledWith(options[2]);
    expect(input.value).toBe('');

    const overlay = container.querySelector('.vx-icon-192');
    expect(overlay).toBeInTheDocument();
    overlay && fireEvent.click(overlay);
    expect(field.input.onChange).toHaveBeenLastCalledWith([]);
    await waitFor(() => {
      expect(handleChange).toHaveBeenLastCalledWith();
    });

  });

  it('allows multi-selection, chip removal and select-all override', async () => {
    const field = createFieldState([]);
    const handleChange = vi.fn();

    let renderKey = 0;
    const { rerender } = render(
      <SmartSelector
        key={`smart-${renderKey}`}
        name='smart'
        options={options}
        multiple
        allowAll
        onChange={handleChange}
      />
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    const user = userEvent.setup();

    const focusAndSelect = async (label: string) => {
      input.focus();
      fireEvent.focus(input);
      await user.clear(input);
      await user.type(input, label.slice(0, 1).toLowerCase());
      await waitFor(() => {
        let dropdown = document.querySelector(
          '.vox-scroll-design'
        ) as HTMLElement | null;
        if (!dropdown) {
          input.focus();
          fireEvent.focus(input);
          dropdown = document.querySelector(
            '.vox-scroll-design'
          ) as HTMLElement | null;
        }
        expect(dropdown).not.toBeNull();
        const option = Array.from(dropdown!.querySelectorAll('div')).find(
          (node) => node.textContent?.trim() === label
        );
        expect(option).toBeTruthy();
      });
      const dropdown = document.querySelector(
        '.vox-scroll-design'
      ) as HTMLElement;
      const option = Array.from(dropdown.querySelectorAll('div')).find(
        (node) => node.textContent?.trim() === label
      ) as HTMLElement;
      expect(option).toBeTruthy();
      fireEvent.mouseDown(option);
    };

    await focusAndSelect('Alpha');
    expect(field.input.onChange).toHaveBeenCalledWith([options[0]]);

    act(() => {
      const newSelection = [
        ...(field.input.value as IOption[]),
        options[1],
      ];
      field.input.onChange(newSelection);
      rerender(
        <SmartSelector
          key={`smart-${++renderKey}`}
          name='smart'
          options={options}
          multiple
          allowAll
          onChange={handleChange}
        />
      );
    });
    expect(field.input.value).toEqual([
      options[0],
      options[1],
    ]);
    await waitFor(() => {
      expect(screen.getByText('Beta')).toBeInTheDocument();
    });
    expect(handleChange).toHaveBeenLastCalledWith([options[0]]);

    const alphaChip = screen
      .getByText('Alpha')
      .closest('div');
    const alphaRemove = alphaChip?.querySelector('.vx-icon-192');
    alphaRemove && fireEvent.click(alphaRemove);
    expect(field.input.onChange).toHaveBeenLastCalledWith([options[1]]);
    expect(handleChange).toHaveBeenCalledTimes(1);

    const allSelection = [{ label: 'Todos', value: 0 }];
    act(() => {
      field.input.onChange(allSelection as IOption[]);
      rerender(
        <SmartSelector
          key={`smart-${++renderKey}`}
          name='smart'
          options={options}
          multiple
          allowAll
          onChange={handleChange}
        />
      );
    });
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Todos')).toBeInTheDocument();

    expect(field.input.onChange).toHaveBeenLastCalledWith([
      { label: 'Todos', value: 0 },
    ]);

    const allChip = screen.getByText('Todos').closest('div');
    const allRemove = allChip?.querySelector('.vx-icon-192');
    allRemove && fireEvent.click(allRemove);
    expect(field.input.onChange).toHaveBeenLastCalledWith([]);
    expect(handleChange).toHaveBeenCalledTimes(2);
    expect(handleChange).toHaveBeenLastCalledWith();

  });

  it('renders button actions, icons and validation feedback', () => {
    const field = createFieldState([]);
    const handleClick = vi.fn();

    const { container, rerender } = render(
      <SmartSelector
        name='smart'
        options={options}
        icon='111'
        borderless
        button
        buttonIcon='222'
        onClick={handleClick}
        meta={{ touched: true, error: 'smart.error' } as any}
      />
    );

    const wrapper = container.querySelector('div.rounded-lg');
    expect(wrapper?.className).not.toContain('border-gray-200');
    expect(screen.getByText('smart.error')).toBeInTheDocument();

    const button = container.querySelector('button[name="btn-input-action"]');
    expect(button).toBeInTheDocument();
    button && fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);

    rerender(
      <SmartSelector
        name='smart'
        options={options}
        icon='999'
        end
      />
    );

    const trailingIcon = container.querySelector('span.vx-icon-999');
    expect(trailingIcon).toBeInTheDocument();
  });
});
