import { type FunctionComponent } from 'preact';
import { useTranslation } from 'react-i18next';

export const DatabasesTab: FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('h_databases')}</h1>
    </div>
  );
};
