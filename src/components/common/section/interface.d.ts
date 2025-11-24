import { PropsWithChildren } from 'preact/compat';

export interface ISectionProps extends PropsWithChildren {
  className?: string;
  padding?: boolean;
  loading?: boolean;
  header?: any;
}
