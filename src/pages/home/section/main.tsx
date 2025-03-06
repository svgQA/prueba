import { Button } from '@/components/common/button/button';
import HomeMainDesktopImg from '@/assets/image/home-main-desktop.png';

export const HomeMain = () => {
  return (
    <div className='flex relative min-h-[85vh] md:flex-row flex-col text-center md:text-left'>
      <div className='w-full md:w-2/5 flex flex-col items-center px-4 md:px-10 py-6 md:py-7'>
        <div className='pb-1 md:pb-10'>
          <h1 className='text-xl sm:text-1xl md:text-4xl lg:text-5xl mb-3 mt-8 sm:mt-14 md:mt-28'>
            Transforma la Gestión de Operaciones Con Tryvoo
          </h1>
          <span className='text-2xl sm:text-3xl px-2'>
            Optimiza la gestión de actividades, recursos y activos, incluso sin{' '}
            <span className='font-bold'>conectividad para tus negocios</span>
          </span>
        </div>
        <Button
          label='Agenda una Demo gratis'
          type='button'
          id='schedule'
          name='schedule'
          text='text-xl md:text-2xl'
          padding='px-6 py-4 my-2 md:my-4'
          className='bg-secondary rounded-full object-contain hover:bg-m6 transition-colors'
          textColor='text-blue-dark'
        />
      </div>

      <div className='w-full md:w-3/5 flex items-center justify-center md:justify-start overflow-hidden px-4 sm:px-6 md:px-0'>
        <img
          src={HomeMainDesktopImg}
          alt='Tryvoo platform interface'
          className='w-full sm:w-4/5 md:w-auto md:h-[60vh] object-contain z-[10] md:mr-7'
        />
      </div>

      <div className='absolute bottom-0 left-0 w-full h-[30vh] bg-white'> </div>
    </div>
  );
};
