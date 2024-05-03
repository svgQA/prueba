import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

export const HomePage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'Voxline';
  }, []);
  return <section>HOME</section>;
};
