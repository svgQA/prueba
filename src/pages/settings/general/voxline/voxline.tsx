import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

export const VoxlineSettingPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'Voxline Settings';
  }, []);
  return <section>VOXLINE</section>;
};
