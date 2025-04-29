import { Button } from '@/components/common/button/button';
import { tryvoo_services } from '../utils/data/services';
import { useTranslation } from 'react-i18next';

export const HomeService = () => {
  const { t } = useTranslation();

  return (
    <div className='flex flex-col items-center text-center bg-primary-opacity bg-opacity-100 py-5 px-4 sm:px-6 md:px-8'>
      <span className='text-2xl sm:text-3xl md:text-4xl font-bold text-[#349396] mb-2'>
        {t('services.title')}
      </span>
      <span className='text-lg sm:text-xl md:text-2xl text-[#349396] max-w-3xl mx-auto'>
        {t('services.subtitle')}
      </span>

      <div className='w-full max-w-7xl mx-auto'>
        <div className='flex flex-row gap-4 md:gap-6 mt-7 flex-wrap justify-center'>
          {tryvoo_services.map((item) => (
            <div
              key={item.id}
              className='flex flex-col items-center text-center w-96 h-full rounded-2xl overflow-hidden shadow-lg bg-white p-4 md:p-6 border border-gray-200 hover:bg-[#20314F] text-[#349396] hover:text-white transition-all duration-300'
            >
              <div className='w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full overflow-hidden flex items-center justify-center bg-gray-100 mb-4'>
                <img
                  className='w-full h-full object-cover'
                  src={item.image}
                  alt={item.titleKey ? t(item.titleKey) : ''}
                />
              </div>
              <div className='flex-1 flex flex-col justify-between'>
                <div>
                  <h2 className='text-lg sm:text-xl md:text-2xl font-semibold mb-2'>
                    {item.titleKey && t(item.titleKey)}
                  </h2>
                  <p className='text-sm sm:text-base md:text-lg text-gray-600 hover:text-gray-200'>
                    {item.subtitleKey && t(item.subtitleKey)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button
        label={t('services.button')}
        type='button'
        id='schedule'
        name='schedule'
        className='bg-[#20314F] text-white mb-4 mt-10 text-base sm:text-lg md:text-xl rounded-full px-6 py-3 sm:px-8 sm:py-4 w-full sm:w-auto min-w-[200px] max-w-[400px] transition-all duration-300 hover:bg-opacity-90'
      />
    </div>
  );
};
