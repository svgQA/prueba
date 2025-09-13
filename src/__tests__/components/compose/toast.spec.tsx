import { describe, it, vi } from 'vitest';
import { render, screen } from '@testing-library/preact';
import { CustomToast } from '@/components/compose/toast/CustomToast';
import type { VoxError } from '@/utils/network/error';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (str: string) => str }),
}));

describe('Components | Compose | Toast', () => {
  it('renders error message', () => {
    const error: VoxError = {
      timestamp: '2024-01-01T00:00:00Z',
      url: '/test',
      message: 'some error',
      code: 500,
      data: { error: 'fail' },
    };
    render(<CustomToast data={error} />);
    expect(screen.getByText(error.message)).toBeInTheDocument();
  });
});
