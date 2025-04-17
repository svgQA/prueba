import { Button } from '@/components/common/button/button';
import { tryvoo_solutions } from '../utils/data/solutions';
import { useTranslation } from 'react-i18next';

export const HomeSolutions = () => {
  const { t } = useTranslation();

  return (
    <div className='flex flex-col items-center text-center bg-white text-ternary py-12'>
      <span className='text-3xl font-bold mb-5 text-ternary'>
        {t('solutions.title')}
      </span>
      <span className='text-xl text-gray-700'>{t('solutions.subtitle')}</span>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10 mb-10 px-4 w-full max-w-7xl'>
        {tryvoo_solutions.map((item) => (
          <div
            key={item.id}
            className='hover:border-2 hover:border-primary border-gray-100 border flex flex-col sm:flex-row items-center shadow-lg rounded-lg w-full'
          >
            <div className='bg-primary rounded-lg w-full sm:w-1/3 h-48 sm:h-full flex items-center justify-center p-4'>
              <img
                src={item.image}
                alt={item.titleKey ? t(item.titleKey) : ''}
                className='h-auto w-[80%] max-w-[150px] object-contain'
              />
            </div>
            <div className='text-left w-full sm:w-2/3 p-6'>
              <h2 className='text-xl sm:text-2xl font-semibold text-gray-800 mb-2'>
                {item.titleKey && t(item.titleKey)}
              </h2>
              <p className='text-gray-700 text-base sm:text-lg'>
                {item.subtitleKey && t(item.subtitleKey)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Button
        label={t('solutions.button')}
        type='button'
        id='schedule'
        name='schedule'
        className='bg-[#20314F] text-[#FFF] mb-4 text-xl rounded-full !p-5'
      />
    </div>
  );
};
