import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

export const ShiftsPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'VX - Shifts Service';
  }, []);
  return <section>Memos</section>;
};
