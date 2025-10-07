import { Section } from '@/components/common/section/section';
import { FunctionComponent } from 'preact';
import { useTranslation } from 'react-i18next';

export const UserGroupsPage: FunctionComponent = () => {
  const { t } = useTranslation();
  return (
    <Section className='pt-2'>
      <div>
        <h1>{t('h_title_groups')}</h1>
      </div>
    </Section>
  );
};
