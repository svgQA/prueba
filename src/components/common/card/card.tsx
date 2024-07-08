import { type FunctionComponent } from 'preact';
import { type ICardProps } from './interface';

export const Card: FunctionComponent<ICardProps> = ({
  id,
  name,
  children,
}: ICardProps) => {
  return (
    <div
      id={id}
      name={name}
      className='capitalize w-full rounded-lg p-2 bg-neutral-200 bg-opacity-40 my-1 min-w-40 overflow-hidden'
    >
      {children}
    </div>
  );
};
