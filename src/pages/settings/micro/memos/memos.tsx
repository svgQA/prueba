import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

export const MemosSetting: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'Memos Settings';
  }, []);
  return <section></section>;
};
