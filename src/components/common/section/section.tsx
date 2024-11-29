import { FunctionComponent } from 'preact';
import { ISectionProps } from './interface';

export const Section: FunctionComponent<ISectionProps> = ({
  children,
  className,
}: ISectionProps) => {
  return (
    <section className={`${className} mr-3 my-1 pt-7 relative px-7`}>
      {children}
    </section>
  );
};
