import { FunctionComponent } from 'preact';
import { PropsWithChildren } from 'preact/compat';

interface Props extends PropsWithChildren {
  padding?: boolean;
  loading?: boolean;
  cards?: any;
  buttons?: any;
  modals?: any;
  navigation?: any;
  className?: string;
  relative?: boolean;
}

export const SectionPage: FunctionComponent<Props> = ({
  children,
  className,
  padding,
  cards,
  buttons,
  modals,
  relative,
}: Props) => {
  return (
    <section className={`${padding ? 'px-2 pt-2' : 'p-0'} ${className}`}>
      {cards}
      <div className={`max-h-screen ${relative ? 'relative' : ''}`}>
        {/* bg-b-content dark:bg-b-dark */}
        <div className='py-2 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center overflow-visible xl:absolute z-0'>
          {buttons}
        </div>
        {children}
      </div>
      {modals}
    </section>
  );
};
