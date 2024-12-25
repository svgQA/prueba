import { expect, it, describe } from 'vitest';
import { render, screen } from '@testing-library/preact';
import { Button } from '@/components/common/button/button';

describe('Components | Common | Button', () => {
  it('check text property is ok', () => {
    const textInBtn = 'test_1_btn';
    render(<Button id='' name='' label={textInBtn} type='button' />);
    expect(screen.getByText(textInBtn));
  });
});
