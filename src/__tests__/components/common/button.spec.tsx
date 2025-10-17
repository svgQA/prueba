import { cleanup, fireEvent, render, screen } from '@testing-library/preact';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Button } from '@/components/common/button/button';

const tMock = vi.fn((key: string) => `t:${key}`);
const getCurrentPermissionsMock = vi.fn(() => ({}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: tMock }),
}));

vi.mock('@/store/signals/access/permission', () => ({
  getCurrentPermissions: () => getCurrentPermissionsMock(),
}));

describe('Components | Common | Button', () => {
  beforeEach(() => {
    tMock.mockClear();
    getCurrentPermissionsMock.mockReset();
    getCurrentPermissionsMock.mockReturnValue({});
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the translated label and triggers the click handler', () => {
    const handleClick = vi.fn();
    render(
      <Button
        id='primary'
        name='primary'
        label='submit_action'
        onClick={handleClick}
      />
    );

    const button = screen.getByRole('button', { name: /t:submit_action/i });
    expect(button).toBeEnabled();

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(tMock).toHaveBeenCalledWith('submit_action');
  });

  it('hides the button when the permission flag is missing', () => {
    getCurrentPermissionsMock.mockReturnValue({ other: true });

    const { queryByRole } = render(
      <Button id='restricted' name='restricted' keyName='delete-item' />
    );

    expect(queryByRole('button')).not.toBeInTheDocument();
    expect(getCurrentPermissionsMock).toHaveBeenCalled();
  });

  it('renders when the permission flag is granted', () => {
    getCurrentPermissionsMock.mockReturnValue({ 'download-report': true });

    const { container } = render(
      <Button id='download' name='download' keyName='download-report' />
    );

    const button = container.querySelector('#download-button');
    expect(button).toBeInTheDocument();
  });

  it('shows a trailing icon with the configured size', () => {
    render(
      <Button
        id='decorated'
        name='decorated'
        label='decorated_button'
        icon='041'
        end
        iconSize='lg'
      />
    );

    const button = screen.getByRole('button', { name: /t:decorated_button/i });
    const icons = button.querySelectorAll('.vx-icon-041');
    expect(icons).toHaveLength(1);
    expect(icons[0]).toHaveClass('size-lg');
  });

  it('renders an icon-only rounded control when rounded is true', () => {
    render(
      <Button
        id='round'
        name='round'
        rounded
        icon='200'
        borderless
        transparent
      />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('rounded-full');
    expect(button.textContent).toBe('');
  });
});
