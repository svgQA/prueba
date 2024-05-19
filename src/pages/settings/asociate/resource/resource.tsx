import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

export const ResourcesSettingPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'Resources Settings';
  }, []);
  return <section>RESOURCES SETTINGS</section>;
};
