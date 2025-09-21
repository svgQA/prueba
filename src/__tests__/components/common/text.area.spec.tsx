import { render, screen } from '@testing-library/preact';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TextArea } from '@/components/common/text.area/text.area';

const tMock = vi.fn((key: string) => `t:${key}`);

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: tMock }),
}));

describe('Components | Common | TextArea', () => {
  beforeEach(() => {
    tMock.mockClear();
  });

  it('translates the label and placeholder while rendering a leading icon', () => {
    const { container } = render(
      <TextArea
        id='textarea-basic'
        name='field'
        label='textarea.label'
        placeholder='textarea.placeholder'
        icon='201'
        value=''
      />
    );

    expect(screen.getByText('t:textarea.label')).toBeInTheDocument();
    const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
    expect(textarea.placeholder).toBe('t:textarea.placeholder');
    expect(container.querySelector('.vx-icon-201')).toBeInTheDocument();
  });

  it('renders a trailing icon when the end flag is provided', () => {
    const { container } = render(
      <TextArea
        id='textarea-trailing'
        name='field'
        icon='305'
        end
        value=''
      />
    );

    const icons = container.querySelectorAll('.vx-icon-305');
    expect(icons).toHaveLength(1);
    expect(icons[0].parentElement?.className).toContain('flex');
  });

  it('shows validation messages from meta, error and warning props', () => {
    render(
      <TextArea
        id='textarea-validation'
        name='field'
        value=''
        meta={{ touched: true, error: 'meta.error' } as any}
        error='textarea.error'
        warning='textarea.warning'
      />
    );

    expect(screen.getByText('t:meta.error')).toBeInTheDocument();
    expect(screen.getByText('t:textarea.error')).toBeInTheDocument();
    expect(screen.getByText('t:textarea.warning')).toBeInTheDocument();
  });

  it('applies thin and disabled styles and merges custom class names', () => {
    const { getByRole } = render(
      <TextArea
        id='textarea-flags'
        name='field'
        value=''
        thin
        disabled
        className='custom-class'
      />
    );

    const textarea = getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.className).toMatch(/py-1/);
    expect(textarea.className).toMatch(/opacity-50/);
    expect(textarea.className).toMatch(/custom-class/);
  });
});
