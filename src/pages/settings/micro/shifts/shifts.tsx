import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

export const ShiftsSettingPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'Shifts Settings';
  }, []);
  return <section>SHIFTS</section>;
};
