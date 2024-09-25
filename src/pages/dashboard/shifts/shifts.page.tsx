import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { AudioButton } from './audio/socket.button';

export const ShiftsPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'VX - Shifts Service';
  }, []);
  return (
    <section>
      <h2>Shift</h2>
      <AudioButton />
    </section>
  );
};
