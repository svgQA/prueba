import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

export const GroupSettingPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'Security Group Settings';
  }, []);
  return <section>SECURITY GROUP</section>;
};
