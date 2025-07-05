// import { VOX_LATITUDE_SERVICE_URL } from '@/utils/Network/constants';
// import { latitude_service_url } from '@/env.config';
import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
// import { LatitudeEmbed } from '@latitude-data/react';

export const AnalyticAdminSettingPage: FunctionComponent = () => {
  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('p_analityc');
  }, []);
  return (
    <section>
      ANALYTIC
      {/* <LatitudeEmbed url={latitude_service_url} /> */}
    </section>
  );
};
