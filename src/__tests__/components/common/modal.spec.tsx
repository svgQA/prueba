import { fireEvent, render, screen } from '@testing-library/preact';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Modal } from '@/components/common/modal/modal';

const tMock = vi.fn((key: string) => `t:${key}`);
const ThemeButtonMock = vi.fn((props: { rounded?: boolean }) => (
  <button data-testid='theme-toggle' data-rounded={String(!!props.rounded)} />
));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: tMock }),
}));

vi.mock('@/components/compose/button', () => ({
  ThemeButton: (props: { rounded?: boolean }) => ThemeButtonMock(props),
}));

describe('Components | Common | Modal', () => {
  beforeEach(() => {
    tMock.mockClear();
    ThemeButtonMock.mockClear();
  });

  it('hides the dialog content when it is not open', () => {
    const { container } = render(
      <Modal id='modal' open={false} header='modal.title'>
        <span>content</span>
      </Modal>
    );

    const wrapper = container.querySelector('#modal') as HTMLDivElement;
    expect(wrapper.className).toContain('hidden');
    expect(tMock).toHaveBeenCalledWith('modal.title');
  });

  it('renders translated header, body, footer and theme toggle when open', () => {
    const footer = <button type='button'>Confirmar</button>;
    const { container } = render(
      <Modal
        id='modal-open'
        open
        header='modal.header'
        footer={footer}
        theme
        transparent
        shadowed
        width='w-96'
        position='absolute'
      >
        <p>Modal body</p>
      </Modal>
    );

    const wrapper = container.querySelector('#modal-open')!;
    expect(wrapper.className).not.toContain('hidden');
    expect(wrapper.className).toContain('bg-transparent');
    expect(wrapper.className).toContain('absolute');

    expect(screen.getByText('t:modal.header')).toBeInTheDocument();
    expect(screen.getByText('Modal body')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirmar' })).toBeInTheDocument();

    const panel = wrapper.querySelector(':scope > div')!;
    expect(panel.className).toContain('w-96');
    expect(panel.className).toContain('shadow-lg');

    const themeToggle = screen.getByTestId('theme-toggle');
    expect(themeToggle.getAttribute('data-rounded')).toBe('true');
    expect(ThemeButtonMock).toHaveBeenCalledTimes(1);
  });

  it('invokes the onClose callback when the close control is clicked', () => {
    const onClose = vi.fn();
    const { container } = render(
      <Modal id='modal-close' open header='modal.close' onClose={onClose}>
        <span>content</span>
      </Modal>
    );

    const closeButton = container.querySelector('#setting-close-button') as HTMLButtonElement;
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('toggles the expansion state and notifies the consumer', () => {
    const setExpandable = vi.fn();
    const { container } = render(
      <Modal
        id='modal-expand'
        open
        header='modal.expand'
        expandable
        setExpandable={setExpandable}
      >
        <span>content</span>
      </Modal>
    );

    const wrapper = container.querySelector('#modal-expand')!;
    const expandButton = container.querySelector('#setting-expand-button') as HTMLButtonElement;

    expect(expandButton.querySelector('.vx-icon-058')).toBeTruthy();
    expect(wrapper.className).toContain('p-7');

    fireEvent.click(expandButton);
    expect(setExpandable).toHaveBeenCalledWith(true);
    expect(expandButton.querySelector('.vx-icon-276')).toBeTruthy();
    expect(wrapper.className).not.toContain('p-7');

    fireEvent.click(expandButton);
    expect(setExpandable).toHaveBeenLastCalledWith(false);
    expect(expandButton.querySelector('.vx-icon-058')).toBeTruthy();
  });

  it('renders footer content only when it is provided', () => {
    const { queryByRole, rerender } = render(
      <Modal id='modal-footer' open header='modal.footer'>
        <span>content</span>
      </Modal>
    );

    expect(queryByRole('button', { name: 'Aceptar' })).not.toBeInTheDocument();

    rerender(
      <Modal
        id='modal-footer'
        open
        header='modal.footer'
        footer={<button type='button'>Aceptar</button>}
      >
        <span>content</span>
      </Modal>
    );

    expect(screen.getByRole('button', { name: 'Aceptar' })).toBeInTheDocument();
  });
});
