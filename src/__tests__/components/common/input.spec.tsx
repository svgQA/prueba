import { fireEvent, render, screen } from '@testing-library/preact';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Input } from '@/components/common/input/input';

const tMock = vi.fn((key: string) => `t:${key}`);

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: tMock }),
}));

vi.mock('@/store/signals/access/permission', () => ({
  getCurrentPermissions: () => ({}),
}));

describe('Components | Common | Input', () => {
  beforeEach(() => {
    tMock.mockClear();
  });

  it('translates the label and placeholder while rendering the leading icon', () => {
    const handleChange = vi.fn();
    const { container } = render(
      <Input
        id='input-basic'
        name='field'
        label='input.label'
        placeholder='input.placeholder'
        icon='101'
        value=''
        onChange={handleChange}
      />
    );

    expect(screen.getByText('t:input.label')).toBeInTheDocument();
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input.placeholder).toBe('t:input.placeholder');
    expect(container.querySelector('.vx-icon-101')).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'new value' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('runs the action callback when the auxiliary button is clicked or Enter is pressed', () => {
    const onClick = vi.fn();
    const { container } = render(
      <Input
        id='input-action'
        name='field'
        value='current value'
        button
        buttonLabel='input.action'
        onClick={onClick}
        onKeyUp={() => {}}
      />
    );

    const button = screen.getByRole('button', { name: 't:input.action' });
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledWith('current value');

    onClick.mockClear();
    const input = container.querySelector('input') as HTMLInputElement;
    fireEvent.keyUp(input, { key: 'Enter' });
    expect(onClick).toHaveBeenCalledWith('current value');

    onClick.mockClear();
    fireEvent.keyUp(input, { key: 'Escape' });
    expect(onClick).not.toHaveBeenCalled();
  });

  it('triggers the date picker when clicking on date inputs and renders the picker icon', () => {
    const originalShowPicker = (HTMLInputElement.prototype as any).showPicker;
    const showPicker = vi.fn();
    (HTMLInputElement.prototype as any).showPicker = showPicker;

    const { container, rerender } = render(
      <Input id='input-date' name='date' type='date' value='2024-01-01' />
    );

    const input = container.querySelector('input') as HTMLInputElement;
    fireEvent.click(input);
    expect(showPicker).toHaveBeenCalledTimes(1);
    expect(container.querySelector('svg')).toBeInTheDocument();

    showPicker.mockClear();
    rerender(<Input id='input-date' name='date' type='date' value='2024-01-01' disabled />);
    fireEvent.click(container.querySelector('input') as HTMLInputElement);
    expect(showPicker).not.toHaveBeenCalled();

    (HTMLInputElement.prototype as any).showPicker = originalShowPicker;
  });

  it('renders validation messages coming from meta, error and warning props', () => {
    render(
      <Input
        id='input-validation'
        name='field'
        value=''
        meta={{ touched: true, error: 'meta.error' } as any}
        error='input.error'
        warning='input.warning'
        float
      />
    );

    const metaMessage = screen.getByText('t:meta.error');
    expect(metaMessage.className).toContain('absolute');
    expect(screen.getByText('t:input.error')).toBeInTheDocument();
    expect(screen.getByText('t:input.warning')).toBeInTheDocument();
  });
});
