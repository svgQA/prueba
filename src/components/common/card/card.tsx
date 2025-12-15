import { type FunctionComponent } from 'preact';
import { type ICardProps } from './interface';

export const Card: FunctionComponent<ICardProps> = ({
  id,
  children,
  color = 'text-t-light dark:text-t-dark',
  shadow = false,
  maxWidth,
  rounded = true,
  borderless = false,
  transparent = false,
}: ICardProps) => {
  return (
    <div
      id={id}
      className={`${borderless ? 'ring-0' : 'ring-1 ring-gray-100 dark:ring-b-dark-light'}
      ${rounded ? 'rounded-lg' : ''}
      ${color}  ${shadow ? 'shadow-md' : ''} ${maxWidth}
      ${transparent ? 'bg-transparent' : 'bg-white dark:bg-b-dark-dark'}
      text-t-light dark:text-t-dark
      px-0.5
      relative capitalize h-fit transition duration-300 focus:outline-2`}
    >
      {children}
    </div>
  );
};
