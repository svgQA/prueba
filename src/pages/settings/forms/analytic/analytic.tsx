import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

export const FormAnalyticSettingPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'Forms Analytic Settings';
  }, []);
  return <section>FORMS ANALYTIC SETTINGS</section>;
};
