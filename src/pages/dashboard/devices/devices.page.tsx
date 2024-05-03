import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

export const DevicesPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'VX - Devices Service';
  }, []);
  return <section>Devices</section>;
};
