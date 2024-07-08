// import { VOX_LATITUDE_SERVICE_URL } from '@/utils/network/constants';
import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
// import { LatitudeEmbed } from '@latitude-data/react';

export const AnalyticAdminSettingPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'Analytic Admin Settings';
  }, []);
  return (
    <section className='h-full bg-neutral-100'>
      ANALYTIC
      {/* <LatitudeEmbed url={VOX_LATITUDE_SERVICE_URL} /> */}
    </section>
  );
};
