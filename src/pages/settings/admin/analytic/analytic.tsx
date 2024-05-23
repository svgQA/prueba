import { VOX_LATITUDE_SERVICE_URL } from '@/utils/network/constants';
import { LatitudeEmbed } from '@latitude-data/react';
import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

export const AnalyticAdminSettingPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'Analytic Admin Settings';
  }, []);
  return (
    <section className='h-full'>
      <LatitudeEmbed url={VOX_LATITUDE_SERVICE_URL} />
    </section>
  );
};
