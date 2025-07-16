import { PlandCard } from './component/plan.card';
import { plans_data } from '../utils/data/plan';
import { useTranslation } from 'react-i18next';

export const HomePlans = () => {
  const { t } = useTranslation();

  return (
    <div className='flex flex-col items-center text-center bg-white text-gray-700 py-10 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8'>
      <div className='max-w-7xl w-full mx-auto'>
        <span className='text-2xl sm:text-3xl md:text-4xl font-bold text-blue-dark block mb-2'>
          {t('i_plans_title')}
        </span>
        <span className='text-lg sm:text-xl md:text-2xl text-gray-700 block mb-8 sm:mb-12'>
          {t('i_plans_subtitle')}
        </span>

        <div className='flex flex-row gap-4 md:gap-6 mt-7 flex-wrap justify-center'>
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
    </div>
  );
};
