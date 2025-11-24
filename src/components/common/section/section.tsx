import { FunctionComponent } from 'preact';
import { ISectionProps } from './interface';
import { Loading } from '../loading/loading';

export const Section: FunctionComponent<ISectionProps> = ({
  children,
  className = 'mr-3 my-1 relative',
  padding = false,
  loading = false,
  header,
}: ISectionProps) => {
  return (
    <section className={`${padding ? 'px-7 pt-7' : 'p-0'} ${className}`}>
      <div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between absolute -top-20 z-10 right-0'>
        {header}
      </div>
      {children}
      {loading && <Loading />}
    </section>
  );
};
