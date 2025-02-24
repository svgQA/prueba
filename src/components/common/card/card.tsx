import { type FunctionComponent } from 'preact';
import { type ICardProps } from './interface';

export const Card: FunctionComponent<ICardProps> = ({
  id,
  children,
  color = 'bg-opacity-40 bg-b-light-dark dark:bg-b-dark-light',
  shadow = false,
  maxWidth,
}: ICardProps) => {
  return (
    <div
      id={id}
      className={`${color} ${shadow ? 'shadow-md' : ''} ${maxWidth} relative capitalize rounded-lg p-2 m-1 h-fit transition duration-300`}
    >
      {children}
    </div>
  );
};
