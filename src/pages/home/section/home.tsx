import { useEffect, useState } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
import HomeMainDesktopImg from '@/assets/image/home-main-desktop.png';
import BrandCarousel from './component/brand.carousel';

const heroSlides = [
  HomeMainDesktopImg,
  HomeMainDesktopImg,
  HomeMainDesktopImg,
  HomeMainDesktopImg,
];
const heroFeatures = [
  'h_hero_feature_check',
  'h_hero_feature_reports',
  'h_hero_feature_multitenant',
];

export const HomeHero = () => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      id='inicio'
      className='relative w-full overflow-hidden bg-gradient-to-r from-[#0b1f33] via-[#0b1f33] to-[#0b1f33]'
    >
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.18),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.25),transparent_25%)]' />
      <div className='container relative mx-auto flex min-h-[90vh] flex-col-reverse items-center gap-16 px-4 pb-20 pt-6 sm:px-6 md:min-h-[92vh] md:flex-row md:items-stretch md:gap-12 md:px-8 lg:pt-12'>
        <div className='flex w-full flex-col justify-center text-center text-white md:w-1/2 md:text-left'>
          <div className='mb-6 inline-flex items-center gap-2 self-center rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white md:self-start'>
            {t('h_hero_badge')}
          </div>
          <h1 className='text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl lg:text-6xl'>
            {t('h_hero_title')}
          </h1>
          <p className='mt-5 max-w-2xl text-lg leading-relaxed text-white/90 md:text-xl'>
            {t('h_hero_description')}
          </p>
          <div className='mt-8 flex flex-wrap items-center justify-center gap-4 md:justify-start'>
            <a
              href='#beta'
              className='rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg transition-all duration-200 hover:translate-y-[-1px] hover:shadow-xl'
            >
              {t('h_cta_beta')}
            </a>
            <button
              type='button'
              onClick={() => setShowDemo(true)}
              className='rounded-full border border-white/60 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-white hover:text-[#0b1f33]'
            >
              {t('h_hero_cta_demo')}
            </button>
          </div>

          <div className='mt-12 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2'>
            {heroFeatures.map((featureKey) => (
              <div
                key={featureKey}
                className='rounded-2xl bg-white/5 p-4 text-left shadow-lg ring-1 ring-white/5 backdrop-blur-lg'
              >
                <p className='text-base font-semibold text-white'>
                  {t(featureKey)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className='relative flex w-full items-center justify-center md:w-1/2'>
          <div className='absolute -left-8 -top-6 h-44 w-44 rounded-full bg-primary/20 blur-3xl' />
          <div className='absolute -right-8 bottom-0 h-48 w-48 rounded-full bg-emerald-300/30 blur-3xl' />
          <div className='relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-lg'>
            <div className='relative overflow-hidden rounded-2xl border border-white/10 bg-[#0f1f33]/60 shadow-xl aspect-[16/10]'>
              {heroSlides.map((slide, index) => (
                <img
                  key={index}
                  src={slide}
                  alt={t('h_hero_image_alt')}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
              <div className='flex items-center justify-center gap-2 p-3'>
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    type='button'
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 w-2 rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'w-4 bg-white' : 'bg-white/40'
                    }`}
                  >
                    <span className='sr-only'>
                      {t('h_hero_slide_label', { number: index + 1 })}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className='mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-white/10 p-4 text-white shadow-inner'>
              <div>
                <p className='text-sm font-semibold'>
                  {t('h_hero_stat_coverage')}
                </p>
                <p className='text-2xl font-bold'>24/7</p>
              </div>
              <div>
                <p className='text-sm font-semibold'>
                  {t('h_hero_stat_teams')}
                </p>
                <p className='text-2xl font-bold'>+300</p>
              </div>
              <div>
                <p className='text-sm font-semibold'>
                  {t('h_hero_stat_interventions')}
                </p>
                <p className='text-2xl font-bold'>45%</p>
              </div>
              <div>
                <p className='text-sm font-semibold'>
                  {t('h_hero_stat_errors')}
                </p>
                <p className='text-2xl font-bold'>-30%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='absolute bottom-0 left-0 w-full z-0'>
        <BrandCarousel />
      </div>

      {showDemo && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm'>
          <div className='relative w-full max-w-4xl overflow-hidden rounded-3xl bg-[#0b1f33] shadow-2xl ring-1 ring-white/10'>
            <button
              type='button'
              onClick={() => setShowDemo(false)}
              className='absolute right-3 top-3 z-10 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20'
            >
              <span className='sr-only'>{t('h_hero_demo_close')}</span>✕
            </button>
            <div className='relative aspect-video overflow-hidden bg-gradient-to-br from-primary/30 via-white/5 to-emerald-300/20'>
              <video
                className='absolute inset-0 h-full w-full object-cover'
                src='https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4'
                poster={HomeMainDesktopImg}
                controls
              />
            </div>
            <div className='flex flex-col gap-1 px-6 py-4 text-left text-white/90'>
              <p className='text-sm font-semibold uppercase tracking-[0.15em] text-white/70'>
                {t('h_hero_demo_badge')}
              </p>
              <p className='text-lg font-bold text-white'>
                {t('h_hero_demo_title')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
