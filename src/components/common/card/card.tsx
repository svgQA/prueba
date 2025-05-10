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
      className={`${borderless ? 'border-0' : 'border-2 border-gray-100 dark:border-b-dark-light'}
      ${rounded ? 'rounded-lg' : ''}
      ${color}  ${shadow ? 'shadow-md' : ''} ${maxWidth}
      ${transparent ? 'bg-transparent' : 'bg-white dark:bg-b-dark-dark'}
      text-t-light dark:text-t-dark
      relative capitalize p-2 m-1 h-fit transition duration-300 focus:outline-2`}
    >
      {children}
    </div>
  );
};
