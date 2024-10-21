import { type FunctionComponent } from 'preact';
import { type ICardProps } from './interface';

export const Card: FunctionComponent<ICardProps> = ({
  id,
  name,
  children,
  color = 'bg-neutral-200 bg-opacity-40',
}: ICardProps) => {
  return (
    <div
      id={id}
      name={name}
      className={`${color} capitalize rounded-lg p-2 m-1 h-fit`}
    >
      {children}
    </div>
  );
};
