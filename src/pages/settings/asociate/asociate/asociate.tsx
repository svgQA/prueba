import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

export const AsociateSettingPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'Asociate Settings';
  }, []);
  return <section>ASOCIATE SETTINGS</section>;
};
