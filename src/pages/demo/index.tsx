import React, { useEffect } from 'react';
import { DemoForm } from '@/components/compose/demo/demo';
import { useTranslation } from 'react-i18next';

const DemoPage: React.FC = () => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = `VX - ${t('demo.pageTitle')}`;
  }, [t]);

  return (
    <>
      <DemoForm />
    </>
  );
};

export default DemoPage;
