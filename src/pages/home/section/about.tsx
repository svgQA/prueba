import { useEffect, useState } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
import HomeAboutCenterImg from '@/assets/image/home-we-center.png';

const aboutSlides = [
  HomeAboutCenterImg,
  HomeAboutCenterImg,
  HomeAboutCenterImg,
  HomeAboutCenterImg,
];

export const HomeAbout = () => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % aboutSlides.length);
    }, 4200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      id='nosotros'
      className='relative flex flex-col items-center bg-[#0b1f33] px-4 py-16 text-white sm:px-6 md:px-8'
    >
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_90%_0%,rgba(16,185,129,0.18),transparent_30%)]' />
      <div className='relative mx-auto flex w-full max-w-6xl flex-col gap-10 md:flex-row md:items-center'>
        <div className='space-y-6 md:w-1/2'>
          <p className='inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white'>
            {t('h_about_badge')}
          </p>
          <h2 className='text-3xl font-bold leading-tight sm:text-4xl'>
            {t('h_about_title')}
          </h2>
          <p className='text-lg text-white/85'>
            {t('h_about_description')}
          </p>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div className='rounded-2xl border border-white/15 bg-white/5 p-4 shadow-lg backdrop-blur-lg'>
              <p className='text-sm font-semibold text-emerald-200'>
                {t('h_about_architecture_title')}
              </p>
              <p className='text-base text-white/90'>
                {t('h_about_architecture_desc')}
              </p>
            </div>
            <div className='rounded-2xl border border-white/15 bg-white/5 p-4 shadow-lg backdrop-blur-lg'>
              <p className='text-sm font-semibold text-emerald-200'>
                {t('h_about_interoperability_title')}
              </p>
              <p className='text-base text-white/90'>
                {t('h_about_interoperability_desc')}
              </p>
            </div>
            <div className='rounded-2xl border border-white/15 bg-white/5 p-4 shadow-lg backdrop-blur-lg'>
              <p className='text-sm font-semibold text-emerald-200'>
                {t('h_about_offline_title')}
              </p>
              <p className='text-base text-white/90'>
                {t('h_about_offline_desc')}
              </p>
            </div>
            <div className='rounded-2xl border border-white/15 bg-white/5 p-4 shadow-lg backdrop-blur-lg'>
              <p className='text-sm font-semibold text-emerald-200'>
                {t('h_about_security_title')}
              </p>
              <p className='text-base text-white/90'>
                {t('h_about_security_desc')}
              </p>
            </div>
          </div>
        </div>

        <div className='relative md:w-1/2'>
          <div className='absolute -left-6 -top-6 h-24 w-24 rounded-full bg-emerald-400/30 blur-3xl' />
          <div className='absolute -right-6 bottom-0 h-24 w-24 rounded-full bg-primary/30 blur-3xl' />
          <div className='relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-lg'>
            <div className='relative flex items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#0f1f33]/50 shadow-inner aspect-[16/10]'>
              {aboutSlides.map((slide, index) => (
                <img
                  key={index}
                  src={slide}
                  alt={t('h_about_slide_alt')}
                  className={`absolute inset-0 mx-auto h-full w-full object-contain p-4 transition-opacity duration-700 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
              <div className='absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-gradient-to-t from-[#0b1f33]/90 via-transparent to-transparent p-4'>
                {aboutSlides.map((_, index) => (
                  <button
                    key={index}
                    type='button'
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 w-2 rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'w-4 bg-white' : 'bg-white/40'
                    }`}
                  >
                    <span className='sr-only'>Slide {index + 1}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className='mt-6 rounded-2xl bg-white/10 p-4 text-left shadow-inner'>
              <p className='text-sm uppercase tracking-wide text-emerald-200'>
                {t('h_about_highlight_badge')}
              </p>
              <p className='text-lg font-semibold text-white'>
                {t('h_about_highlight_title')}
              </p>
              <p className='mt-2 text-sm text-white/85'>
                {t('h_about_highlight_desc')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
