import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { useTranslation } from 'react-i18next';

export const PaymentHistorySettingPage: FunctionComponent = () => {
  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('p_payment');
  }, []);
  return <section>PAYMENT HISTORY</section>;
};
