// import { authStatus, logout } from '@/store';
import { FunctionComponent, VNode } from 'preact';
import { PropsWithChildren } from 'preact/compat';

export const Security: FunctionComponent<PropsWithChildren> = ({
  children,
}: PropsWithChildren): VNode => {
  // if (!authStatus.value) {
  //   logout();
  // }
  return <>{children}</>;
};
