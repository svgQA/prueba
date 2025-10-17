import { cleanup, fireEvent, render, screen } from '@testing-library/preact';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Select } from '@/components/common/select/select';

const tMock = vi.fn((key: string) => `t:${key}`);

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: tMock }),
}));

describe('Components | Common | Select', () => {
  beforeEach(() => {
    tMock.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it('translates label and placeholder while rendering leading icons and notifying changes', () => {
    const handleChange = vi.fn();
    const { container } = render(
      <Select
        id='select-basic'
        name='status'
        label='select.label'
        placeholder='select.placeholder'
        icon='200'
        options={[
          { value: 'open', label: 'Open' },
          { value: 'closed', label: 'Closed' },
        ]}
        onChange={handleChange}
      />
    );

    expect(screen.getByText('t:select.label')).toBeInTheDocument();
    const select = container.querySelector('select') as HTMLSelectElement;
    expect(select.value).toBe('');
    expect(select.placeholder).toBeUndefined();
    expect(select.querySelectorAll('option')).toHaveLength(3);
    expect(select.querySelector('option')?.textContent).toBe(
      't:select.placeholder'
    );
    expect(container.querySelector('.vx-icon-200')).toBeInTheDocument();

    fireEvent.change(select, { target: { value: 'closed' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('supports trailing icons, borderless appearance and custom option mappings', () => {
    const { container } = render(
      <Select
        id='select-custom'
        name='priority'
        placeholder='select.choose'
        end
        icon='300'
        borderless
        optionValue='code'
        optionLabel='title'
        options={
          [
            { code: 'h', title: 'High' },
            { code: 'l', title: 'Low' },
          ] as any
        }
        disabled
      />
    );

    const wrapper = container.querySelector('div.w-full');
    expect(wrapper?.className).not.toContain('border-gray-200');

    const select = container.querySelector('select') as HTMLSelectElement;
    expect(select).toBeDisabled();
    const optionValues = Array.from(select.querySelectorAll('option')).map(
      (option) => option.getAttribute('value')
    );
    expect(optionValues).toEqual(['', 'h', 'l']);
    expect(select.querySelector('option[value="h"]')?.textContent).toBe('High');
    expect(container.querySelector('.vx-icon-300')).toBeInTheDocument();
  });

  it('renders validation messages coming from meta and error props', () => {
    render(
      <Select
        id='select-validation'
        name='status'
        options={[]}
        meta={{ touched: true, error: 'meta.error' } as any}
        error='select.error'
      />
    );

    expect(screen.getByText('meta.error')).toBeInTheDocument();
    expect(screen.getByText('select.error')).toBeInTheDocument();
  });
});
