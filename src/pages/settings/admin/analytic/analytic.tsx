import { LatitudeEmbed } from '@latitude-data/react';
import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { LATITUDE_SERVICE_URL } from './constant';

export const AnalyticAdminSettingPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'Analytic Admin Settings';
  }, []);
  return (
    <section className='h-[80vh]'>
      <LatitudeEmbed url={LATITUDE_SERVICE_URL} />
    </section>
  );
};
