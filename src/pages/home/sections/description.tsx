import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

export const DescriptionHomeSlice: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'VX Description Slice';
  }, []);
  return <section>Description</section>;
};
