import { FunctionComponent } from 'preact';
import { PropsWithChildren } from 'preact/compat';

interface Props extends PropsWithChildren {}

export const ButtonsPage: FunctionComponent<Props> = ({ children }: Props) => {
  return (
    <div className='flex flex-wrap items-center gap-2 sm:gap-3 w-full'>
      {children}
    </div>
  );
};
