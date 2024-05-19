import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

export const FormCreateSettingPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'Forms Create Settings';
  }, []);
  return <section>FORMS CREATE SETTINGS</section>;
};
