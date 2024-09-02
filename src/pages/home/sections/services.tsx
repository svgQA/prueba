import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

export const ServicesHomeSlice: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'VX Services Slice';
  }, []);
  return <section>Services</section>;
};
