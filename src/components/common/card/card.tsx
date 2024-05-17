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
      className='capitalize w-full rounded p-2 bg-gray-100 my-1'
    >
      {children}
    </div>
  );
};
