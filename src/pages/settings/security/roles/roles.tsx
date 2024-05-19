import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

export const RolesSettingPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'Security Roles Settings';
  }, []);
  return <section>SECURITY ROLES</section>;
};
