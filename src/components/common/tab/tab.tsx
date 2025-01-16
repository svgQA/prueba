import { PropsWithChildren } from 'preact/compat';

interface TabProps extends PropsWithChildren {
  title: string;
  isActive?: boolean;
  onClick?: () => void;
}

export const Tab = (_: TabProps) => {
  return <></>;
};
