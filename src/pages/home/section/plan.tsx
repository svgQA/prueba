import { PlandCard } from './component/plan.card';
import { plans_data } from '../utils/data/plan';
import { useTranslation } from 'react-i18next';

export const HomePlans = () => {
  const { t } = useTranslation();

  return (
    <div className='flex flex-col items-center text-center bg-white text-gray-700 pt-[70px] !md:h-[100vh] h-auto'>
      <span className='text-3xl font-bold text-blue-dark'>
        {t('plans.title')}
      </span>
      <span className='text-xl text-gray-700'>{t('plans.subtitle')}</span>

      <div className='flex flex-wrap gap-6 justify-center mt-7 mb-10'>
        {plans_data.map((plan, index) => (
          <PlandCard
            key={index}
            pricing={t(plan.pricingKey)}
            bgColor={plan.bgColor}
            name={t(plan.nameKey)}
            action={t(plan.actionKey)}
            subtitle={t(plan.subtitleKey)}
            border={plan.border}
            options={plan.optionsKeys.map((optionKey) => t(optionKey))}
            inverse={plan.inverse}
          />
        ))}
      </div>
    </div>
  );
};
