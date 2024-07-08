import { type FunctionComponent } from 'preact';
import { type ILayerProps } from './interface';

export const Card: FunctionComponent<ILayerProps> = ({
  id,
  name,
  children,
}: ILayerProps) => {
  return (
    <div
      id={id}
      name={name}
      className='capitalize w-full rounded p-2 bg-gray-100 my-1 min-w-40 overflow-hidden'
    >
      {children}
    </div>
  );
};
