import { render, screen } from '@testing-library/preact';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Avatar } from '@/components/common/Avatar';

type Presigned = Parameters<typeof Avatar>[0]['src'];

const getTenantMock = vi.fn(() => 'tenant-id');
const getCompanyIdMock = vi.fn(() => 'company-id');

vi.mock('@/env.config', () => ({
  cdn_service_url: 'https://cdn.voxline.test',
}));

vi.mock('@/store/slices', () => ({
  useUserStore: () => ({
    getTenant: getTenantMock,
    getCompanyId: getCompanyIdMock,
  }),
}));

describe('Components | Common | Avatar', () => {
  beforeEach(() => {
    getTenantMock.mockClear();
    getCompanyIdMock.mockClear();
    getTenantMock.mockReturnValue('tenant-id');
    getCompanyIdMock.mockReturnValue('company-id');
  });

  it('renders an icon avatar when icon prop is provided', () => {
    const { container } = render(
      <Avatar icon='123' toolTipLabel='Information' size='lg' />
    );

    const wrapper = container.querySelector('div[title="Information"]');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveClass('rounded-full');

    const icon = container.querySelector('.vx-icon-123');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('size-xl');
    expect(getTenantMock).not.toHaveBeenCalled();
    expect(getCompanyIdMock).not.toHaveBeenCalled();
  });

  it('renders a plain image when src is a string', () => {
    render(
      <Avatar
        src='https://static.example.com/img.png'
        name='Jane Doe'
        toolTipLabel='Profile image'
      />
    );

    const image = screen.getByRole('img', { name: 'Jane Doe' });
    expect(image).toHaveAttribute('src', 'https://static.example.com/img.png');
    expect(image).toHaveAttribute('title', 'Profile image');
    expect(image).toHaveClass('object-cover');
    expect(getTenantMock).not.toHaveBeenCalled();
    expect(getCompanyIdMock).not.toHaveBeenCalled();
  });

  it('builds the cdn url when receiving a presigned request source', () => {
    const src: Exclude<Presigned, string | undefined> = {
      uuid: 'abc-123',
      name: 'avatar.jpg',
      type: 'image/jpeg',
      area: 'user',
    };

    render(<Avatar src={src} name='Alex' />);

    const image = screen.getByRole('img', { name: 'Alex' });
    expect(image).toHaveAttribute(
      'src',
      'https://cdn.voxline.test/tenant-id/company-id/user/abc-123-avatar.jpg'
    );
    expect(getTenantMock).toHaveBeenCalledTimes(1);
    expect(getCompanyIdMock).toHaveBeenCalledTimes(1);
  });

  it('falls back to the capitalized initial when no source is provided', () => {
    render(<Avatar name='   marta stone  ' toolTipLabel='User avatar' />);

    const fallback = screen.getByTitle('User avatar');
    expect(fallback).toHaveTextContent('M');
    expect(fallback).toHaveClass('rounded-full');
  });

  it('applies a squared shape when square is true', () => {
    const { container } = render(<Avatar name='Bob' square />);

    const element = container.querySelector('div');
    expect(element).toBeInTheDocument();
    expect(element).toHaveClass('rounded');
    expect(element).not.toHaveClass('rounded-full');
  });
});
