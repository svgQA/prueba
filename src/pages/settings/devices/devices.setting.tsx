import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

export const DevicesSetting: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'Device Settings';
  }, []);
  return <section></section>;
};
