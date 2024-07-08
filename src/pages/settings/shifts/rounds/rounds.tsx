import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

export const RoundsSettingPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'Rounds Settings';
  }, []);
  return <section>ROUNDS</section>;
};
