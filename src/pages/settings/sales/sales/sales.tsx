import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

export const SalesSettingPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'Sales Settings';
  }, []);
  return <section>SALES SETTINGS</section>;
};
