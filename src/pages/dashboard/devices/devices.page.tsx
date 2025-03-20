import { Section } from '@/components/common/section/section';
import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

export const DevicesPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'VX - Devices Service';
  }, []);
  return <Section padding>Devices</Section>;
};
