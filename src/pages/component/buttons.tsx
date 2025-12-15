import { FunctionComponent } from 'preact';
import { PropsWithChildren } from 'preact/compat';

interface Props extends PropsWithChildren {
  className?: string;
}

export const ButtonsPage: FunctionComponent<Props> = ({
  children,
  className,
}: Props) => {
  return (
    <div
      className={`flex flex-wrap items-center gap-2 sm:gap-3 w-full ${className}`}
    >
      {children}
    </div>
  );
};
