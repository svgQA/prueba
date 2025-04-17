import { Button } from '@/components/common/button/button';
import { tryvoo_services } from '../utils/data/services';
import { useTranslation } from 'react-i18next';

export const HomeService = () => {
  const { t } = useTranslation();

  return (
    <div className='flex flex-col items-center text-center bg-primary-opacity bg-opacity-100 py-5'>
      <span className='text-2xl md:text-2xl font-bold text-[#349396]'>
        {t('services.title')}
      </span>
      <span className='text-lg md:text-xl text-[#349396]'>
        {t('services.subtitle')}
      </span>

      <div className='w-full px-4 md:px-6'>
        <div className='flex flex-wrap gap-4 md:gap-6 justify-center mt-7'>
          {tryvoo_services.map((item) => (
            <div
              key={item.id}
              className='flex flex-col items-center text-center w-full sm:w-[45%] lg:w-[45vh] max-w-sm h-[60vh] rounded-2xl overflow-hidden shadow-lg bg-white p-4 md:p-6 border border-gray-200 hover:bg-[#20314F] text-[#349396] hover:text-white'
            >
              <img
                className='w-full md:w-auto h-36 md:h-48 object-cover rounded-lg'
                src={item.image}
                alt={item.titleKey ? t(item.titleKey) : ''}
              />
              <div className='mt-4'>
                <h2 className='text-lg md:text-lg font-semibold'>
                  {item.titleKey && t(item.titleKey)}
                </h2>
                <p className='mt-2'>
                  {item.subtitleKey && t(item.subtitleKey)}
                </p>
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
        className='bg-[#20314F] text-[#FFFF] mb-4 mt-10 text-lg md:text-xl rounded-full p-4 md:p-5 w-[90%] md:w-[400px]'
      />
    </div>
  );
};
