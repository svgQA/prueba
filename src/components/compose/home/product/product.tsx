import { Card } from '@/components/common';
import { type FunctionComponent } from 'preact';
import { type ICardProductHomeMenuProps } from './interface';

export const CardProductHomeMenu: FunctionComponent<
  ICardProductHomeMenuProps
> = ({ id, name, icon = 'users' }: ICardProductHomeMenuProps) => {
  return (
    <Card id={id} name={name}>
      <div className='text-gray-400 hover:text-gray-800 px-2 bg-blue-200'>
        <span className={`vx-icon vx-${icon} size-xl`} />
      </div>
    </Card>
  );
};
