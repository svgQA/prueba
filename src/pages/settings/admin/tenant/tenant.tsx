import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

export const TenantSettingPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'Tenant Settings';
  }, []);
  return <section>TENANTS</section>;
};
