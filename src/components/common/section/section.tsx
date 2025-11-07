import { FunctionComponent } from 'preact';
import { ISectionProps } from './interface';
import { Loading } from '../loading/loading';

export const Section: FunctionComponent<ISectionProps> = ({
  children,
  className = 'mr-3 my-1 relative',
  padding = false,
  loading = false,
}: ISectionProps) => {
  return (
    <section className={`${padding ? 'px-7 pt-7' : 'p-0'} ${className}`}>
      {children}
      {loading && <Loading />}
    </section>
  );
};
