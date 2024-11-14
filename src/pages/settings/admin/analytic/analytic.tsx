// import { VOX_LATITUDE_SERVICE_URL } from '@/utils/Network/constants';
import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
// import { LatitudeEmbed } from '@latitude-data/react';

export const AnalyticAdminSettingPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'Analytic Admin Settings';
  }, []);
  return (
    <section>
      ANALYTIC
      {/* <LatitudeEmbed url={VOX_LATITUDE_SERVICE_URL} /> */}
    </section>
  );
};
