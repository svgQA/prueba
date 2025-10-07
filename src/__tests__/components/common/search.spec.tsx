import { cleanup, fireEvent, render, screen } from '@testing-library/preact';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Search } from '@/components/common/search/search';
import { modulesReport } from '@/types/form';

const tMock = vi.fn((key: string) => key);
const reportAutomaticMock = vi.fn();
let latestRangeProps: any;

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: tMock }),
}));

vi.mock('@/components/common/report-automatic/report-automatic', () => ({
  ReportAutomatic: (props: any) => {
    reportAutomaticMock(props);
    return <div data-testid='report-automatic' data-modules={props.modules} />;
  },
}));

vi.mock('@/components/common/table/components/range/range', () => ({
  RangeDateFilter: (props: any) => {
    latestRangeProps = props;
    return (
      <div
        data-testid='range-filter'
        data-open={props.isOpen.value ? 'true' : 'false'}
        data-column={props.column}
      />
    );
  },
}));

describe('Components | Common | Search', () => {
  beforeEach(() => {
    tMock.mockClear();
    reportAutomaticMock.mockClear();
    latestRangeProps = undefined;
  });

  afterEach(() => {
    cleanup();
  });

  const baseKeys = [
    { id: 'status', label: 'status', type: 'text' },
    { id: 'createdAt', label: 'createdAt', type: 'date' },
  ];

  it('translates the placeholder and respects the disabled flag', () => {
    render(
      <Search id='search-bar' placeholder='search.placeholder' disabled />
    );

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(tMock).toHaveBeenCalledWith('search.placeholder');
  });

  it('removes an existing text filter when the close icon is clicked', async () => {
    const handleChange = vi.fn();
    render(
      <Search
        id='search-bar'
        keys={baseKeys}
        value={[{ id: 'status', value: ['closed'], type: 'text' }]}
        onChange={handleChange}
      />
    );

    fireEvent.click(screen.getByText('×'));

    expect(handleChange).toHaveBeenCalledWith([]);
    expect(screen.queryByText(/closed/)).not.toBeInTheDocument();
  });

  it('removes the last filter with Backspace when the input is empty', () => {
    const handleChange = vi.fn();
    render(
      <Search
        id='search-bar'
        keys={baseKeys}
        value={[
          { id: 'status', value: ['open'], type: 'text' },
          { id: 'createdAt', value: ['2024-01-01'], type: 'date' },
        ]}
        onChange={handleChange}
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'Backspace' });

    expect(handleChange).toHaveBeenCalledWith([
      { id: 'status', value: ['open'], type: 'text' },
    ]);
  });

  it('notifies range clearing when removing a date filter chip', () => {
    const handleChange = vi.fn();
    const handleRangeChange = vi.fn();
    render(
      <Search
        id='search-bar'
        keys={baseKeys}
        value={[
          {
            id: 'createdAt',
            value: ['2024-01-01', '2024-01-31'],
            type: 'date',
          },
        ]}
        onChange={handleChange}
        onRangeChange={handleRangeChange}
      />
    );

    fireEvent.click(screen.getByText('×'));

    expect(handleChange).toHaveBeenCalledWith([]);
    expect(handleRangeChange).toHaveBeenCalledWith(null);
  });

  it('exposes the RangeDateFilter callback to external handlers', () => {
    const handleRangeChange = vi.fn();
    render(
      <Search
        id='search-bar'
        keys={baseKeys}
        onRangeChange={handleRangeChange}
      />
    );

    expect(latestRangeProps?.onRangeChange).toBeTypeOf('function');
    const rangeValue = { createdAt: ['2024-01-01', '2024-01-31'] };
    latestRangeProps?.onRangeChange?.(rangeValue);
    expect(handleRangeChange).toHaveBeenCalledWith(rangeValue);
  });

  it('renders the optional group slot and modules report trigger when provided', () => {
    render(
      <Search
        id='search-bar'
        keys={baseKeys}
        table
        modules={modulesReport.Shift}
        group={<div data-testid='group-slot'>Custom group</div>}
      />
    );

    expect(screen.getByTestId('group-slot')).toBeInTheDocument();
    expect(screen.getByTestId('report-automatic')).toHaveAttribute(
      'data-modules',
      modulesReport.Shift
    );
    expect(reportAutomaticMock).toHaveBeenCalledWith(
      expect.objectContaining({ modules: modulesReport.Shift })
    );
  });
});
