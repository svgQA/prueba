import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

export const VoxlineSettingPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'TR Settings';
  }, []);
  return <section>Tryvoo</section>;
};
