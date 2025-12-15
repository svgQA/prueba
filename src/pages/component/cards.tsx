import { FunctionComponent } from 'preact';
import { PropsWithChildren } from 'preact/compat';

interface Props extends PropsWithChildren {
  className?: string;
}

export const CardsPage: FunctionComponent<Props> = ({
  children,
  className,
}: Props) => {
  if (!children) return <></>;
  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-3 py-0.5 ${className}`}
    >
      {children}
    </div>
  );
};
