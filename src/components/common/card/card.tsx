import { type FunctionComponent } from 'preact';
import { type ICardProps } from './interface';

export const Card: FunctionComponent<ICardProps> = ({
  id,
  children,
  color = 'bg-b-white border dark:bg-b-dark-light',
  shadow = false,
  maxWidth,
}: ICardProps) => {
  return (
    <div
      id={id}
      className={`${color} ${shadow ? 'shadow-md' : ''} ${maxWidth} relative capitalize rounded-lg p-1 m-1 h-fit transition duration-300 hover:bg-neutral-100 focus:outline-2`}
    >
      {children}
    </div>
  );
};
