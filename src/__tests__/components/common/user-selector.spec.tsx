import { cleanup, render } from '@testing-library/preact';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { UserSelector } from '@/components/common/user-selector/user-selector';

const tMock = vi.fn((key: string) => `translated:${key}`);
const customSelectorMock = vi.fn((props: any) => (
  <div data-testid='custom-selector' {...props} />
));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: tMock }),
}));

vi.mock('@/components/common/custom-selector/custom-selector', () => ({
  CustomSelector: (props: any) => customSelectorMock(props),
}));

describe('Components | Common | UserSelector', () => {
  beforeEach(() => {
    tMock.mockClear();
    customSelectorMock.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it('translates custom placeholder keys and forwards properties', () => {
    const props = {
      name: 'users',
      options: [{ label: 'One', value: 1 }],
      placeholder: 'custom.placeholder',
      menuPortalTarget: document.createElement('div'),
      onChange: vi.fn(),
      value: [{ label: 'Initial', value: 0 }],
    };

    render(<UserSelector {...props} />);

    expect(tMock).toHaveBeenCalledWith('custom.placeholder');
    expect(customSelectorMock).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'users',
        options: props.options,
        value: props.value,
        placeholder: 'translated:custom.placeholder',
        menuPortalTarget: props.menuPortalTarget,
      })
    );
  });

  it('falls back to the default search translation when no placeholder is provided', () => {
    render(<UserSelector name='users' options={[]} onChange={vi.fn()} />);

    expect(tMock).toHaveBeenCalledWith('p_search_users');
    expect(customSelectorMock).toHaveBeenCalledWith(
      expect.objectContaining({ placeholder: 'translated:p_search_users' })
    );
  });
});
