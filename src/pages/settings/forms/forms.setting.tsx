import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

export const FormsSetting: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'Forms Settings';
  }, []);
  return <section></section>;
};
