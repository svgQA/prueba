import { useTranslation } from 'react-i18next';
import HomeTryvooDesktopImg from '@/assets/image/home-desktop-with-tryvoo.png';
import { tryvoo_pros } from '../utils/data/pros';

export const HomePros = () => {
  const { t } = useTranslation();

  return (
    <div
      id='beneficios'
      className='bg-gradient-to-b from-white to-[#eef4ff] text-gray-800 py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8'
    >
      <div className='mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-2 md:items-center'>
        <div className='space-y-6'>
          <p className='inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-primary'>
            {t('h_pros_badge')}
          </p>
          <h2 className='text-3xl font-bold leading-tight sm:text-4xl'>
            {t('h_pros_title')}
          </h2>
          <p className='text-lg text-gray-600'>{t('h_pros_description')}</p>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            {tryvoo_pros.slice(0, 4).map((item, index) => (
              <div
                key={item.titleKey}
                className='group rounded-2xl border border-[#d7e3f2] bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl'
              >
                <div className='flex items-center gap-3'>
                  <img
                    src={item.image}
                    alt=''
                    className='h-12 w-12 rounded-xl object-contain'
                  />
                  <div>
                    <p className='text-sm font-semibold text-primary'>
                      {t('h_pros_kpi', { number: index + 1 })}
                    </p>
                    <p className='text-base font-bold text-[#0b1f33]'>
                      {t(item.titleKey ?? '')}
                    </p>
                  </div>
                </div>
                <p className='mt-3 text-sm text-gray-600'>
                  {t(item.subtitleKey ?? '')}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className='relative'>
          <div className='absolute -left-6 -top-6 h-32 w-32 rounded-full bg-primary/15 blur-3xl' />
          <div className='absolute -right-6 bottom-0 h-32 w-32 rounded-full bg-emerald-300/25 blur-3xl' />
          <div className='relative overflow-hidden rounded-3xl border border-[#d7e3f2] bg-white shadow-2xl'>
            <img
              src={HomeTryvooDesktopImg}
              alt='Dashboard de Tryvoo'
              className='w-full object-contain'
            />
            <div className='grid grid-cols-2 gap-4 border-t border-[#d7e3f2] bg-[#f7fbff] p-5 text-left'>
              <div>
                <p className='text-sm text-gray-500'>
                  {t('h_pros_stat_overtime')}
                </p>
                <p className='text-2xl font-bold text-primary'>-25%</p>
              </div>
              <div>
                <p className='text-sm text-gray-500'>
                  {t('h_pros_stat_scheduling')}
                </p>
                <p className='text-2xl font-bold text-primary'>-30%</p>
              </div>
              <div>
                <p className='text-sm text-gray-500'>
                  {t('h_pros_stat_rounds')}
                </p>
                <p className='text-2xl font-bold text-primary'>+40%</p>
              </div>
              <div>
                <p className='text-sm text-gray-500'>
                  {t('h_pros_stat_reports')}
                </p>
                <p className='text-2xl font-bold text-primary'>100%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
