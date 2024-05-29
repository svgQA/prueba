import { type FunctionComponent } from 'preact';
import { type ISlideProps } from './interface';

export const Slide: FunctionComponent<ISlideProps> = ({
  children,
}: ISlideProps) => {
  return (
    <div className='h-full py-2 flex justify-center items-center content-center'>
      {children}
    </div>
  );
};
