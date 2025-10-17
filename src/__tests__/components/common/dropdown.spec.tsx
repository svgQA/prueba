import { cleanup, fireEvent, render, screen } from '@testing-library/preact';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Dropdown } from '@/components/common/dropdown/dropdown';

const tMock = vi.fn((key: string) => key);

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: tMock }),
}));

describe('Components | Common | Dropdown', () => {
  beforeEach(() => {
    tMock.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  const options = [
    { label: 'first_option', value: '1', icon: '001' },
    { label: 'second_option', value: '2' },
  ];

  it('renders the provided label and placeholder', () => {
    render(
      <Dropdown
        id='status'
        name='status'
        label='select_status'
        placeholder='choose_one'
        options={options}
      />
    );

    expect(screen.getByText('select_status')).toBeInTheDocument();
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('choose_one');
  });

  it('opens and closes the menu when interacting with the trigger', () => {
    render(
      <Dropdown
        id='priority'
        name='priority'
        options={options}
        placeholder='pick'
      />
    );

    const button = screen.getByRole('button');
    const dropdown = screen.getByRole('list');

    expect(dropdown.parentElement).toHaveClass('hidden');
    fireEvent.click(button);
    expect(dropdown.parentElement).not.toHaveClass('hidden');
    fireEvent.click(button);
    expect(dropdown.parentElement).toHaveClass('hidden');
  });

  it('selects an item and notifies the parent handler', () => {
    const handleChange = vi.fn();
    render(
      <Dropdown
        id='module'
        name='module'
        options={options}
        placeholder='pick'
        onChange={handleChange}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    const listItem = screen.getByText('first_option');
    fireEvent.click(listItem);

    expect(handleChange).toHaveBeenCalledWith('1');
    expect(screen.getByRole('button')).toHaveTextContent('first_option');
  });

  it('reflects external value updates', () => {
    const { rerender } = render(
      <Dropdown
        id='user'
        name='user'
        options={options}
        placeholder='pick'
        value='1'
      />
    );

    expect(screen.getByRole('button')).toHaveTextContent('first_option');

    rerender(
      <Dropdown
        id='user'
        name='user'
        options={options}
        placeholder='pick'
        value='2'
      />
    );

    expect(screen.getByRole('button')).toHaveTextContent('second_option');
  });

  it('does not open when disabled', () => {
    render(
      <Dropdown
        id='disabled'
        name='disabled'
        options={options}
        placeholder='pick'
        disabled
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);
    const dropdown = screen.getByRole('list');
    expect(dropdown.parentElement).toHaveClass('hidden');
  });
});
