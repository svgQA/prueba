import { Button } from '@/components/common/button/button';
import HomeMainDesktopImg from '@/assets/image/home-main-desktop.png';
import { useTranslation } from 'react-i18next';
import BrandCarousel from './component/brand.carousel';

export const HomeMain = () => {
  const { t } = useTranslation();

  return (
    <div className='relative w-full bg-gradient-to-r from-cyan-500 to-emerald-400'>
      <div className='container mx-auto min-h-[85vh] md:min-h-[90vh] flex flex-col md:flex-row items-center justify-evenly px-4 sm:px-6 md:px-8 py-10 sm:py-16 md:py-20'>
        <div className='w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left mb-8 md:mb-0 text-white'>
          <div className='max-w-xl'>
            <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight'>
              {t('home.title')}
            </h1>
            <div className='text-xl sm:text-2xl md:text-3xl opacity-90 mb-8 md:mb-10'>
              {t('home.subtitle').split('conectividad para tus negocios')[0]}{' '}
              <span className='font-bold'>
                {t('home.subtitle').includes('conectividad para tus negocios')
                  ? 'conectividad para tus negocios'
                  : 'connectivity for your business'}
              </span>
            </div>
            <div className='flex justify-center md:justify-start'>
              <Button
                label={t('home.demoButton')}
                type='button'
                id='schedule'
                name='schedule'
                text='text-lg sm:text-xl md:text-2xl'
                padding='px-6 sm:px-8 py-3 sm:py-4'
                className='bg-secondary rounded-full hover:bg-opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl'
                textColor='text-blue-dark'
              />
            </div>
          </div>
        </div>

        <div className='w-full md:w-1/2 flex items-start justify-center md:justify-end h-full'>
          <div className='relative w-full max-w-2xl'>
            <img
              src={HomeMainDesktopImg}
              alt='Tryvoo platform interface'
              className='w-full h-auto object-contain drop-shadow-2xl'
            />
          </div>
        </div>
      </div>

      <div className='absolute bottom-0 left-0 w-full'>
        <BrandCarousel />
      </div>
    </div>
  );
};
