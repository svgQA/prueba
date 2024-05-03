import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

export const MemosPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'VX - Memos Service';
  }, []);
  return <section>Memos</section>;
};
