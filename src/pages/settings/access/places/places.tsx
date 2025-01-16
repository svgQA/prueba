import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

export const PlaceSettingPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'Places Settings';
  }, []);
  return <section>PLACES ACCESS</section>;
};
