import { FunctionComponent } from 'preact';
import { ISectionProps } from './interface';

export const Section: FunctionComponent<ISectionProps> = ({
  children,
}: ISectionProps) => {
  return <section className='mr-3 my-1 relative'>{children}</section>;
};
