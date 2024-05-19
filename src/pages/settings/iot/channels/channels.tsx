import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

export const ChannelsSettingPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'IoT Channels Settings';
  }, []);
  return <section>CHANNELS</section>;
};
