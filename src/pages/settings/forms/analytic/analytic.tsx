import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { useTranslation } from 'react-i18next';

export const FormAnalyticSettingPage: FunctionComponent = () => {
  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('p_setting');
  }, []);
  return <section>{t('i_forms_analytic_settings')}</section>;
};
