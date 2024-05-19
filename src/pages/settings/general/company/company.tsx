import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

export const CompanySettingPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'Company Settings';
  }, []);
  return <section>COMPANY</section>;
};
