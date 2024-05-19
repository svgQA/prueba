import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

export const SoloSettingPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'Solo Settings';
  }, []);
  return <section>SOLO</section>;
};
