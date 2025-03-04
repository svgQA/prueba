import { Button } from '@/components/common/button/button';
import socialIcon1 from '@/assets/image/icon1.svg';
import socialIcon2 from '@/assets/image/icon2.svg';
import socialIcon3 from '@/assets/image/icon3.svg';

export const HomeFooter = () => {
  return (
    <>
      <div className='bg-[#20314F] flex justify-center gap-4 pt-10 pb-10 flex-col sm:flex-row'>
        <div className='w-[90%] sm:w-[30%] mx-4 sm:mx-0'>
          <h2 className='text-[18px] sm:text-[20px] font-bold'>
            Secciones Populares
          </h2>
          <p className='text-[16px] sm:text-[18px] pt-2'>
            Conoce más de tryvoo
          </p>
        </div>

        <div className='w-[90%] sm:w-[30%] mx-4 sm:mx-0'>
          <h3 className='text-[18px] sm:text-[20px] font-bold'>Contáctanos</h3>
          <p className='text-[16px] sm:text-[18px] pt-2'>
            3157789022 - Popayán, Cauca
          </p>
        </div>

        <div className='w-[90%] sm:w-[30%] mx-4 sm:mx-0'>
          <div className='w-full'>
            <h3 className='text-[18px] sm:text-[20px] font-bold'>
              Nuestra redes
            </h3>
          </div>
          <div className='w-full flex pt-2'>
            <img src={socialIcon1} alt='ico-1' className='w-8 sm:w-10 mr-3' />
            <img src={socialIcon2} alt='ico-2' className='w-8 sm:w-10 mr-3' />
            <img src={socialIcon3} alt='ico-3' className='w-8 sm:w-10 mr-3' />
          </div>
        </div>
      </div>
      <div className='flex flex-col sm:flex-row gap-4 w-full mt-7 mb-10 items-center px-4 sm:px-8'>
        <div className='w-full sm:w-[25%] text-[20px] sm:text-[26px] font-bold text-center sm:text-left'>
          <span className='sm:mr-12'>¡Te brindamos asesoria gratuita!</span>
        </div>
        <div className='w-full sm:w-[40%] text-lg sm:text-xl text-center sm:text-left my-4 sm:my-0'>
          <span>
            Para que comiences optimizar tu negocio con herramientas ágiles y
            operables en cualquiers espacio y lugar
          </span>
        </div>
        <div className='w-full sm:w-[25%] text-center'>
          <Button
            label='Inicia ya y disfruta'
            type='button'
            id='schedule'
            name='schedule'
            className='bg-[#20314F] text-[#FFF] mb-4 text-lg sm:text-xl rounded-full !p-4 sm:!p-5 w-full sm:w-auto'
          />
        </div>
      </div>
    </>
  );
};
