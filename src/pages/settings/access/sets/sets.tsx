import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

export const SetsSettingPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'Sets Settings';
  }, []);
  return <section>SETS ACCESS</section>;
};
