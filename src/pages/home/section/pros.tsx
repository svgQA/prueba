import HomeTryvooDesktopImg from '@/assets/image/home-desktop-with-tryvoo.png';
import { tryvoo_pros } from '../utils/data/pros';
import { Button } from '@/components/common/button/button';
import { useTranslation } from 'react-i18next';

export const HomePros = () => {
  const { t } = useTranslation();

  return (
    <div className='bg-white text-center text-gray-500'>
      <h2 className='text-ternary text-2xl md:text-3xl'>{t('pros.title')}</h2>
      <span className='text- pb-5 text-lg md:text-xl block'>
        {t('pros.subtitle')}
      </span>

      <div className='flex flex-col md:flex-row mt-7 px-4 md:px-0'>
        <div className='w-full md:w-1/2 flex flex-col items-center'>
          <img
            src={HomeTryvooDesktopImg}
            alt=''
            className='w-[80%] md:w-[50%] h-auto'
          />
          <span className='font-bold text-xl md:text-2xl px-4 md:px-10 text-left mt-4'>
            {t('pros.stats')}
          </span>
          <p className='text-lg md:text-xl px-4 md:px-10 mt-5 text-left'>
            {t('pros.description')}
          </p>
        </div>

        <div className='w-full md:w-1/2 mt-7'>
          <div className='shadow-xl bg-white rounded-lg mx-4 md:mx-5'>
            {tryvoo_pros.map((item: any, index: number) => (
              <div key={index}>
                <div className='flex items-start space-x-4 p-3 md:p-5'>
                  <div className='h-[15vh] w-[15vh] md:h-[10vh] md:w-[10vh] flex items-center justify-center'>
                    <img
                      src={item.image}
                      alt='Gestión'
                      className='h-auto w-full'
                    />
                  </div>

                  <div className='flex-1 flex items-center h-[15vh] md:h-[10vh]'>
                    <div>
                      <p className='text-left justify-left'>
                        <span className='font-bold text-[#505050] text-lg md:text-xl'>
                          {t(item.titleKey)}
                        </span>
                        <span className='text-[#505050] text-base md:text-lg'>
                          {t(item.subtitleKey)}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {index !== tryvoo_pros.length - 1 && (
                  <div className='w-[90%] h-px bg-[#CECECE] mx-auto'></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Button
        label={t('pros.button')}
        type='button'
        id='schedule'
        name='schedule'
        className='bg-[#20314F] text-[#FFFF] my-10 text-lg md:text-xl rounded-full px-8 py-4'
      />
    </div>
  );
};
