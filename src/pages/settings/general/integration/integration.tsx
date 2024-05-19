import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

export const IntegrationSettingPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'Integration Settings';
  }, []);
  return <section>INTEGRATION</section>;
};
