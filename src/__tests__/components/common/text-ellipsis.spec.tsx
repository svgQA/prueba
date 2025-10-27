import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/preact';
import { TextEllipsis } from '@/components/common/text-ellipsis';

type MeasurementKey =
  | 'clientWidth'
  | 'scrollWidth'
  | 'clientHeight'
  | 'scrollHeight';

const htmlElementPrototype = HTMLElement.prototype;
const originalDescriptors: Partial<Record<MeasurementKey, PropertyDescriptor>> =
  {};

const saveOriginalDescriptors = () => {
  (
    [
      'clientWidth',
      'scrollWidth',
      'clientHeight',
      'scrollHeight',
    ] as MeasurementKey[]
  ).forEach((key) => {
    if (!originalDescriptors[key]) {
      originalDescriptors[key] = Object.getOwnPropertyDescriptor(
        htmlElementPrototype,
        key
      ) as PropertyDescriptor | undefined;
    }
  });
};

const restoreOriginalDescriptors = () => {
  (
    [
      'clientWidth',
      'scrollWidth',
      'clientHeight',
      'scrollHeight',
    ] as MeasurementKey[]
  ).forEach((key) => {
    const descriptor = originalDescriptors[key];
    if (descriptor) {
      Object.defineProperty(htmlElementPrototype, key, descriptor);
    } else {
      delete (htmlElementPrototype as Record<string, unknown>)[key];
    }
  });
};

const mockElementSize = ({
  clientWidth,
  scrollWidth,
  clientHeight,
  scrollHeight,
}: Record<MeasurementKey, number>) => {
  Object.defineProperty(htmlElementPrototype, 'clientWidth', {
    configurable: true,
    get: () => clientWidth,
  });
  Object.defineProperty(htmlElementPrototype, 'scrollWidth', {
    configurable: true,
    get: () => scrollWidth,
  });
  Object.defineProperty(htmlElementPrototype, 'clientHeight', {
    configurable: true,
    get: () => clientHeight,
  });
  Object.defineProperty(htmlElementPrototype, 'scrollHeight', {
    configurable: true,
    get: () => scrollHeight,
  });
};

describe('Components | Common | TextEllipsis', () => {
  beforeEach(() => {
    saveOriginalDescriptors();
  });

  afterEach(() => {
    restoreOriginalDescriptors();
  });

  it('does not set a tooltip when the content fits within the bounds', async () => {
    mockElementSize({
      clientWidth: 120,
      scrollWidth: 120,
      clientHeight: 20,
      scrollHeight: 20,
    });

    render(<TextEllipsis text='Compact text' />);

    const element = screen.getByText('Compact text');
    await waitFor(() => {
      expect(element).not.toHaveAttribute('title');
      expect(element.className).not.toMatch(/cursor-help/);
    });
  });

  it('shows a tooltip and helper cursor when the content overflows', async () => {
    mockElementSize({
      clientWidth: 80,
      scrollWidth: 200,
      clientHeight: 20,
      scrollHeight: 40,
    });

    render(<TextEllipsis text='This content should overflow the container' />);

    const element = screen.getByText(
      'This content should overflow the container'
    );
    await waitFor(() => {
      expect(element).toHaveAttribute(
        'title',
        'This content should overflow the container'
      );
      expect(element.className).toMatch(/cursor-help/);
    });
  });

  it('renders the circular report layout and uses children as content', () => {
    const { container } = render(
      <TextEllipsis type='report'>
        <span>42</span>
      </TextEllipsis>
    );

    const wrapper = container.firstElementChild as HTMLDivElement;
    expect(wrapper).toBeInTheDocument();
    expect(wrapper.textContent).toBe('42');
    expect(wrapper).toHaveClass('rounded-full');
    expect(wrapper).toHaveAttribute('title');
  });

  it('respects the tooltip flag even if the element overflows', async () => {
    mockElementSize({
      clientWidth: 60,
      scrollWidth: 180,
      clientHeight: 18,
      scrollHeight: 36,
    });

    render(<TextEllipsis text='Hidden tooltip' tooltip={false} />);

    const element = screen.getByText('Hidden tooltip');
    await waitFor(() => {
      expect(element).not.toHaveAttribute('title');
      expect(element.className).not.toMatch(/cursor-help/);
    });
  });
});
