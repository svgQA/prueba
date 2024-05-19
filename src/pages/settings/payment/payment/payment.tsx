import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

export const PaymentSettingPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'Payment Settings';
  }, []);
  return <section>PAYMENT</section>;
};
