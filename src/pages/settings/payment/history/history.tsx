import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

export const PaymentHistorySettingPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'Payment History Settings';
  }, []);
  return <section>PAYMENT HISTORY</section>;
};
