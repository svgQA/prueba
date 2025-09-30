import { cleanup, fireEvent, render, screen } from '@testing-library/preact';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  SelectCheck,
  type IOptionCheck,
} from '@/components/common/select-check/select-check';

const tMock = vi.fn((key: string) => key);
const useFieldMock = vi.fn();

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: tMock }),
}));

vi.mock('react-final-form', () => ({
  useField: (name: string) => useFieldMock(name),
}));

type FieldValue = string | IOptionCheck | IOptionCheck[];

const createFieldState = (initialValue: FieldValue = '') => {
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

const createOptions = (): IOptionCheck[] => [
  { label: 'Alpha', value: 'alpha', icon: '100', color: 'warning' },
  { label: 'Beta', value: 'beta', icon: '200', disabled: true },
  { label: 'Gamma', value: 'gamma', icon: '300' },
];

describe('Components | Common | SelectCheck', () => {
  beforeEach(() => {
    tMock.mockClear();
    useFieldMock.mockReset();
  });

  afterEach(() => {
    cleanup();
  });

  it('translates the label, respects sizing and notifies selection changes', () => {
    const field = createFieldState('beta');
    const handleChange = vi.fn();
    const options = createOptions();

    const { container } = render(
      <SelectCheck
        name='status'
        label='select.label'
        options={options}
        size='md'
        onChange={handleChange}
      />
    );

    expect(tMock).toHaveBeenCalledWith('select.label');

    const alphaRadio = screen.getByLabelText('Alpha') as HTMLInputElement;
    const betaRadio = screen.getByLabelText('Beta') as HTMLInputElement;
    expect(betaRadio.checked).toBe(true);
    expect(alphaRadio.checked).toBe(false);

    fireEvent.click(alphaRadio);
    expect(field.input.onChange).toHaveBeenCalledWith('alpha');
    expect(handleChange).toHaveBeenCalledWith(options[0]);

    const alphaLabel = alphaRadio.closest('label');
    const iconSpan = alphaLabel?.querySelector('span.vox-icon');
    const textSpan = alphaLabel?.querySelector('span.font-medium');
    expect(iconSpan?.className).toContain('text-lg');
    expect(textSpan?.className).toContain('text-base');

    expect(container.querySelectorAll('input[type="radio"]').length).toBe(3);
  });

  it('highlights the active option with its color and disables interaction while loading', () => {
    createFieldState('alpha');
    const options = createOptions();

    const { rerender } = render(
      <SelectCheck name='status' options={options} loading />
    );

    const loadingRadios = screen.getAllByRole('radio');
    loadingRadios.forEach((radio) => expect(radio).toBeDisabled());

    const activeLabel = screen.getByLabelText('Alpha').closest('label');
    const activeCard = activeLabel?.querySelector('div.flex');
    expect(activeCard?.className).toContain('border-warning');
    expect(activeCard?.className).toContain('bg-warning/10');
    expect(activeCard?.className).toContain('opacity-50');

    rerender(<SelectCheck name='status' options={options} loading={false} />);

    expect(screen.getByLabelText('Alpha')).not.toBeDisabled();
    expect(screen.getByLabelText('Gamma')).not.toBeDisabled();
    expect(screen.getByLabelText('Beta')).toBeDisabled();
  });

  it('respects option-level disabled state and large sizing styles', () => {
    createFieldState('gamma');
    const options = createOptions();

    render(<SelectCheck name='status' options={options} size='lg' />);

    const betaRadio = screen.getByLabelText('Beta') as HTMLInputElement;
    expect(betaRadio).toBeDisabled();

    const gammaRadio = screen.getByLabelText('Gamma') as HTMLInputElement;
    const gammaLabel = gammaRadio.closest('label');
    const textSpan = gammaLabel?.querySelector('span.font-medium');
    expect(textSpan?.className).toContain('text-xl');
  });
});
