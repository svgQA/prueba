import React, { useEffect } from 'react';
import { DemoForm } from '@/components/compose/demo/demo';
import { useTranslation } from 'react-i18next';

const DemoPage: React.FC = () => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t('p_demo');
  }, [t]);

  return (
    <>
      <DemoForm />
    </>
  );
};

export default DemoPage;
