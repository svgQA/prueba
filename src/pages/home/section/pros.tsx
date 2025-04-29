import HomeTryvooDesktopImg from '@/assets/image/home-desktop-with-tryvoo.png';
import { tryvoo_pros } from '../utils/data/pros';
import { Button } from '@/components/common/button/button';
import { useTranslation } from 'react-i18next';

export const HomePros = () => {
  const { t } = useTranslation();

  return (
    <div className='bg-white text-center text-gray-500 py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8'>
      <div className='max-w-7xl mx-auto'>
        <h2 className='text-ternary text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight'>
          {t('pros.title')}
        </h2>
        <span className='text-xl sm:text-2xl md:text-3xl block mb-12 text-gray-600 font-light'>
          {t('pros.subtitle')}
        </span>

        <div className='flex flex-col md:flex-row'>
          <div className='w-full md:w-1/2 flex flex-col items-center'>
            <div className='w-full max-w-md mx-auto transform hover:scale-105 transition-transform duration-300'>
              <img
                src={HomeTryvooDesktopImg}
                alt=''
                className='w-full h-auto object-contain'
              />
            </div>
            <div className='mt-8 md:mt-12 text-left w-full max-w-md'>
              <span className='font-bold text-2xl sm:text-3xl md:text-4xl block mb-6 text-gray-800'>
                {t('pros.stats')}
              </span>
              <p className='text-lg sm:text-xl md:text-2xl text-gray-600 leading-relaxed'>
                {t('pros.description')}
              </p>
            </div>
          </div>

          <div className='w-full md:w-1/2 mt-10 md:mt-0'>
            <div className='bg-white rounded-2xl shadow-md overflow-hidden border-2 border-gray-100'>
              {tryvoo_pros.map((item: any, index: number) => (
                <div
                  key={index}
                  className='transition-all duration-300 hover:bg-gray-50'
                >
                  <div className='flex items-center p-6 sm:p-8'>
                    <div className='w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100'>
                      <img
                        src={item.image}
                        alt={t(item.titleKey)}
                        className='w-full h-full object-cover'
                      />
                    </div>

                    <div className='ml-6 sm:ml-8 flex-1'>
                      <h3 className='font-bold text-gray-800 text-xl sm:text-2xl md:text-3xl mb-3'>
                        {t(item.titleKey)}
                      </h3>
                      <p className='text-gray-600 text-base sm:text-lg md:text-xl leading-relaxed'>
                        {t(item.subtitleKey)}
                      </p>
                    </div>
                  </div>

                  {index !== tryvoo_pros.length - 1 && (
                    <div className='w-[90%] h-px bg-gray-200 mx-auto'></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='mt-16 sm:mt-20 md:mt-24 flex justify-center'>
          <Button
            label={t('pros.button')}
            type='button'
            id='schedule'
            name='schedule'
            className='bg-[#20314F] text-white text-lg sm:text-xl md:text-2xl rounded-full px-8 sm:px-10 py-4 sm:py-5 transition-all duration-300 hover:bg-opacity-90 hover:shadow-lg min-w-[200px] max-w-[400px]'
          />
        </div>
      </div>
    </div>
  );
};
