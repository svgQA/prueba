import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

export const DevicesSettingPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'IoT Devices Settings';
  }, []);
  return <section>DEVICES</section>;
};
