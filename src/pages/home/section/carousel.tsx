import { tryvoo_carousel } from '../utils/data/carousel';
import { Button } from '@/components/common/button/button';
import { useTranslation } from 'react-i18next';

export const HomeCarousel = () => {
  const { t } = useTranslation();

  return (
    <div className='bg-white w-full flex flex-col items-center pt-14 pb-8'>
      <div className='mx-auto px-4 sm:px-6 lg:px-8 xl:px-16'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center'>
          {tryvoo_carousel.map((card) => (
            <div
              key={card.id}
              className='mx-2 min-w-64 bg-white text-gray-700 rounded-lg shadow-md overflow-hidden transition-shadow duration-300 border-gray-200 border hover:-translate-y-1 hover:shadow-xl'
            >
              <div className='flex items-center justify-center h-[25vh]'>
                <img
                  src={card.image}
                  alt={card.titleKey ? t(card.titleKey) : ''}
                  className='object-cover'
                />
              </div>
              <div className='p-6 space-y-3'>
                <h3 className='text-xl font-bold text-center leading-tight text-ternary'>
                  {card.titleKey && t(card.titleKey)}
                </h3>
                <p className='text-base text-center leading-relaxed'>
                  {card.subtitleKey && t(card.subtitleKey)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {false && (
        <Button
          label={t('i_carousel_viewDetails')}
          type='button'
          id='schedule'
          name='schedule'
          className='bg-[#20314F] text-[#FFFF] text-base sm:text-xl rounded-full !p-3 sm:!p-5 !w-[200px] sm:!w-[300px] md:!w-[400px] mt-8'
        />
      )}
    </div>
  );
};
