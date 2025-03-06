import { tryvoo_carousel } from '../utils/data/carousel';
import { Button } from '@/components/common/button/button';

export const HomeCarousel = () => {
  return (
    <div className='bg-white w-full flex flex-col items-center py-5'>
      <div className='mx-auto px-4 sm:px-6 lg:px-8 xl:px-16'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center'>
          {tryvoo_carousel.map((card) => (
            <div
              key={card.id}
              className='mx-2 min-w-64 bg-white text-gray-700 hover:text-gray-200 hover:bg-blue-dark rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300'
            >
              <div className='flex items-center justify-center h-[25vh]'>
                <img
                  src={card.image}
                  alt={card.title}
                  className='object-cover'
                />
              </div>
              <div className='p-6 space-y-3'>
                <h3 className='text-xl font-bold text-center leading-tight text-ternary'>
                  {card.title}
                </h3>
                <p className='text-base text-center leading-relaxed'>
                  {card.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button
        label='Ver detalle'
        type='button'
        id='schedule'
        name='schedule'
        className='bg-[#20314F] text-[#FFFF] text-base sm:text-xl rounded-full !p-3 sm:!p-5 !w-[200px] sm:!w-[300px] md:!w-[400px] mt-8'
      />
    </div>
  );
};
