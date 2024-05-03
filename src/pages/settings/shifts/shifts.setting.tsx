import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

export const ShiftsSetting: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'Shifts Settings';
  }, []);
  return <section></section>;
};
