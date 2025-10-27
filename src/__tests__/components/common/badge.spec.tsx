import { fireEvent, render, screen } from '@testing-library/preact';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Badge } from '@/components/common/badge/badge';

const tMock = vi.fn((key: string) => `t:${key}`);
const TextEllipsisMock = vi.fn(({ text }: { text: string }) => (
  <span data-testid='ellipsis'>{text}</span>
));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: tMock }),
}));

vi.mock('@/components/common/text-ellipsis', () => ({
  TextEllipsis: (props: { text: string }) => TextEllipsisMock(props),
}));

describe('Components | Common | Badge', () => {
  beforeEach(() => {
    tMock.mockClear();
    TextEllipsisMock.mockClear();
  });

  it('returns null when the label is empty', () => {
    const { container } = render(<Badge label='' />);
    expect(container).toBeEmptyDOMElement();
  });

  it('translates the label, renders the icon and forwards click events', () => {
    const handleClick = vi.fn();
    render(
      <Badge label='badge.label' icon='401' count={3} onClick={handleClick} />
    );

    expect(screen.getByTestId('ellipsis').textContent).toBe('3 t:badge.label');
    expect(tMock).toHaveBeenCalledWith('badge.label');
    expect(document.querySelector('.vx-icon-401')).toBeInTheDocument();

    fireEvent.click(
      screen.getByTestId('ellipsis').parentElement as HTMLElement
    );
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies outline styles and stops propagation when removing the badge', () => {
    const handleClick = vi.fn();
    const handleRemove = vi.fn();
    const { container } = render(
      <Badge
        label='badge.remove'
        status='error'
        outline
        onClick={handleClick}
        onRemove={handleRemove}
      />
    );

    const badge = container.querySelector('span') as HTMLSpanElement;
    expect(badge.className).toContain('border-error');
    expect(badge.className).toContain('text-error');

    const remove = container.querySelector('.vx-icon-045') as HTMLElement;
    fireEvent.click(remove);
    expect(handleRemove).toHaveBeenCalledTimes(1);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
