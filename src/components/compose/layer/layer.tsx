import { type FunctionComponent } from 'preact';
import { type ILayerProps } from './interface';

export const Layer: FunctionComponent<ILayerProps> = ({
  title = 'title',
  subtitle = 'subtitle',
  description = 'description',
  image,
}: ILayerProps) => {
  return (
    <div className='capitalize w-full py-5 mx-20 relative block'>
      <div className='text-white max-w-4xl'>
        <h2 className='text-5xl font-bold mb-2'>{title}</h2>
        <h4 className='text-2xl font-semibold mb-10'>{subtitle}</h4>
        <p className='h-80 text-lg font-medium'>{description}</p>
      </div>
      <div>{image}</div>
    </div>
  );
};
