import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { useTranslation } from 'react-i18next';

export const IotSettingPage: FunctionComponent = () => {
  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('p_iot');
  }, []);
  return <section>IoT</section>;
};
