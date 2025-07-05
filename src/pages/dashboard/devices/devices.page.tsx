import { Section } from '@/components/common/section/section';
import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { useTranslation } from 'react-i18next';

export const DevicesPage: FunctionComponent = () => {
  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('p_devices');
  }, []);
  return <Section padding>Devices</Section>;
};
