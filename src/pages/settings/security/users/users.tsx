import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

export const UsersSettingPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'Security Users Settings';
  }, []);
  return <section>SECURITY USERS</section>;
};
