import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

export const ResourceSettingPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'Resources Settings';
  }, []);
  return <section>RESOURCES ACCESS</section>;
};
