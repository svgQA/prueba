import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

export const IASettingPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'IA Settings';
  }, []);
  return <section>IA SETTINGS</section>;
};
