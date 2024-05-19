import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

export const ModulesSettingPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'Modules Settings';
  }, []);
  return <section>MODULES</section>;
};
