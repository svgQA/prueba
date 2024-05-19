import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

export const KeysSettingPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'Security Keys Settings';
  }, []);
  return <section>SECURITY KEYS</section>;
};
