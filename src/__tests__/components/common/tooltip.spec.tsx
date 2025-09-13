import { describe, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/preact';
import { Tooltip } from '@/components/common/tooltip/tooltip';

describe('Components | Common | Tooltip', () => {
  it('shows tooltip when hovered', async () => {
    render(
      <Tooltip text="Tooltip content">
        <button>trigger</button>
      </Tooltip>
    );
    const trigger = screen.getByText('trigger');
    fireEvent.mouseEnter(trigger.parentElement!.parentElement!);
    expect(await screen.findByText('Tooltip content')).toBeInTheDocument();
  });
});
