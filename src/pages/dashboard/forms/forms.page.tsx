import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

export const FormsPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'VX - Forms Service';
  }, []);
  return <section>Forms</section>;
};
