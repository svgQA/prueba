import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

export const OptimusSettingPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'Optimus Settings';
  }, []);
  return <section>OPTIMUS</section>;
};
