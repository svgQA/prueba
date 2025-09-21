import { fireEvent, render, screen, waitFor } from '@testing-library/preact';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Tooltip } from '@/components/common/tooltip/tooltip';

describe('Components | Common | Tooltip', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('toggles the tooltip visibility on hover and applies custom wrapper classes', async () => {
    const { container } = render(
      <Tooltip text='Tooltip content' className='custom-wrapper'>
        <button>trigger</button>
      </Tooltip>
    );

    const wrapper = container.firstElementChild as HTMLDivElement;
    expect(wrapper.className).toContain('custom-wrapper');

    fireEvent.mouseEnter(wrapper);
    expect(await screen.findByText('Tooltip content')).toBeInTheDocument();

    fireEvent.mouseLeave(wrapper);
    await waitFor(() => {
      expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument();
    });
  });

  it.each([
    ['top', 'mb-1', 'bottom-[-4px]'],
    ['bottom', 'mt-1', 'top-[-4px]'],
    ['left', 'mr-1', 'right-[-4px]'],
    ['right', 'ml-1', 'left-[-4px]'],
  ] as const)(
    'applies offset and arrow classes for the %s position',
    async (position, offsetClass, arrowClass) => {
      render(
        <Tooltip text={`${position} tooltip`} position={position}>
          <span>trigger</span>
        </Tooltip>
      );

      const trigger = screen.getByText('trigger');
      const wrapper = trigger.parentElement!.parentElement as HTMLDivElement;
      fireEvent.mouseEnter(wrapper);

      const tooltip = await screen.findByText(`${position} tooltip`);
      expect(tooltip.className).toContain(offsetClass);
      const arrow = tooltip.querySelector('div');
      expect(arrow?.className).toContain(arrowClass);
    }
  );

  it('positions the tooltip relative to the trigger when it becomes visible', async () => {
    const rect = {
      width: 120,
      height: 40,
      top: 0,
      left: 0,
      right: 120,
      bottom: 40,
      x: 0,
      y: 0,
      toJSON: () => {},
    } as DOMRect;
    const getBoundingClientRectMock = vi
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockReturnValue(rect);

    render(
      <Tooltip text='positioned tooltip' position='right'>
        <span>trigger</span>
      </Tooltip>
    );

    const trigger = screen.getByText('trigger');
    const wrapper = trigger.parentElement!.parentElement as HTMLDivElement;
    fireEvent.mouseEnter(wrapper);

    const tooltip = (await screen.findByText('positioned tooltip')) as HTMLDivElement;
    await waitFor(() => {
      expect(tooltip.style.left).toBe(`${rect.width}px`);
      expect(tooltip.style.top).toBe('50%');
      expect(tooltip.style.transform).toBe('translateY(-50%)');
    });

    getBoundingClientRectMock.mockRestore();
  });
});
