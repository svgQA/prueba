import { type FunctionComponent } from 'preact';
import { type ILayerProps } from './interface';

export const Layer: FunctionComponent<ILayerProps> = ({
  title = 'title',
  subtitle = 'subtitle',
  description = 'description',
  children,
}: ILayerProps) => {
  return (
    <div className='capitalize w-full mx-10 py-5 relative flex flex-row'>
      <div className='max-w-4xl px-10'>
        <h2 className='text-5xl font-bold mb-2'>{title}</h2>
        <h4 className='text-2xl font-semibold mb-10'>{subtitle}</h4>
        <p className='h-10 text-lg font-medium'>{description}</p>
      </div>
      <div className='w-2/4 h-100'>{children}</div>
    </div>
  );
};
