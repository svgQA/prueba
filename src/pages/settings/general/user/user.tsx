import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

export const UserSettingPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'User Settings';
  }, []);
  return <section>USERS</section>;
};
