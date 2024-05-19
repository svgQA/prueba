import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

export const IotSettingPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'IoT Settings';
  }, []);
  return <section>IoT</section>;
};
