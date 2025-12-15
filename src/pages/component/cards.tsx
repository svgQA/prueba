import { FunctionComponent } from 'preact';
import { PropsWithChildren } from 'preact/compat';

interface Props extends PropsWithChildren {}

export const CardsPage: FunctionComponent<Props> = ({ children }: Props) => {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 mb-3 py-0.5'>
      {children}
    </div>
  );
};
