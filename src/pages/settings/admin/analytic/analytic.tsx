import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

export const AnalyticAdminSettingPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'Analytic Admin Settings';
  }, []);
  return <section>ANALYTIC ADMIN</section>;
};
