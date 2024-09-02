import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

export const MainHomeSlice: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'VX Main Slice';
  }, []);
  return <section>Main Siclas</section>;
};
