import { expect, it, describe } from 'vitest';
import { render, screen } from '@testing-library/preact';
import { Dropdown } from '@/components/common';

describe('Components | Common | Dropdown', () => {
  it('check spinner and text property is ok', () => {
    const textInDpn = 'test_1_btn';
    render(<Dropdown id='' name='' label={textInDpn} options={[]} />);
    expect(screen.getByText(textInDpn));
  });
});
