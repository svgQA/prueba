import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

export const DatabaseSettingPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'Database Settings';
  }, []);
  return <section>DATABASES</section>;
};
