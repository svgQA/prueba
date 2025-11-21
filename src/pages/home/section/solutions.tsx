import { useTranslation } from 'react-i18next';
import { tryvoo_solutions } from '../utils/data/solutions';

export const HomeSolutions = () => {
  const { t } = useTranslation();

  return (
    <div
      id='soluciones'
      className='flex flex-col items-center bg-white text-ternary py-16 sm:py-20 px-4 sm:px-6'
    >
      <div className='max-w-6xl text-center'>
        <p className='inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-primary'>
          {t('h_solutions_badge')}
        </p>
        <h2 className='mt-4 text-3xl font-bold leading-tight sm:text-4xl'>
          {t('h_solutions_title')}
        </h2>
        <p className='mt-3 text-lg text-gray-600'>
          {t('h_solutions_description')}
        </p>
      </div>

      <div className='mt-12 grid w-full max-w-6xl grid-cols-1 gap-6 lg:grid-cols-2'>
        {tryvoo_solutions.map((item) => (
          <div
            key={item.id}
            className='group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl'
          >
            <div className='bg-primary p-6 sm:p-8'>
              <img
                src={item.image}
                alt={item.titleKey ?? ''}
                className='h-28 w-auto object-contain'
              />
            </div>
            <div className='flex flex-1 flex-col justify-between space-y-3 p-6'>
              <div>
                <h3 className='text-xl font-bold text-[#0b1f33]'>
                  {item.titleKey ? t(item.titleKey) : ''}
                </h3>
                <p className='mt-2 text-base text-gray-600'>
                  {item.subtitleKey ? t(item.subtitleKey) : ''}
                </p>
              </div>
              <div className='flex items-center gap-3 text-sm font-semibold text-primary'>
                <span className='vx-icon vx-icon-008 size-sm text-primary' />
                {t('h_solutions_ready')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
